import { DISABLED as COMPRESSION_DISABLED, WebSocket, HttpRequest, HttpResponse, us_socket_context_t as usSocketContextT, WebSocketBehavior, RecognizedString } from "uWebSockets.js";
import Connection from "./connections/Connection";
import Connections from "./connections/Connections";
import ConnectionHeadersBuilder, { ConnectionHeaders } from "./connections/ConnectionHeaders";
import JWT from "../../utils/JWT";
import Message from "./messages/Message";
import MessageHandler from "./MessageHandler";
import ErrorResponse from "./responses/ErrorResponse";
import Response from "./responses/Response";

/**
 * Un espacio es una ruta de conexión websocket con un comportamiento específico
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class Space implements WebSocketBehavior {
  private jwt = JWT.getInstance();
  /** Lista de conexiones activas */
  private connections = new Connections();
  /** Endpoint de la conexión socket */
  public path:RecognizedString;
  /** Custom handler para mensajes de websockets */
  public onRawMessage:((websocket:WebSocket, message:ArrayBuffer, _isBinary:boolean) => Promise<void>) | null = null;
  /** Message handler */
  public messageHandler:MessageHandler | null;
  public maxPayloadLength = 16 * 1024;
  public idleTimeout = 60 * 10;
  public compression = COMPRESSION_DISABLED;
  public maxBackpressure = 1024 * 1024;
  public sendPingsAutomatically = false;

  /** Crea un nuevo espacio en una URL determinada */
  constructor(path:RecognizedString) {
    this.path = path;
  }

  public upgrade = (res:HttpResponse, req:HttpRequest, context:usSocketContextT):void => {
    let aborted = false;
    res.onAborted(() => aborted = true);

    const url = req.getUrl();
    const secWebSocketKey = req.getHeader("sec-websocket-key");
    const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
    const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");
    const authorization = req.getHeader("authorization");

    const headers = new ConnectionHeadersBuilder()
      .setUrl(url)
      .setAuthorization(authorization)
      .build();

    setTimeout(() => {
      if(aborted) return;
      else res.upgrade<ConnectionHeaders>(
        { ...headers },
        secWebSocketKey,
        secWebSocketProtocol,
        secWebSocketExtensions,
        context
      );
    }, 50);
  };

  public open = (websocket:WebSocket & Partial<ConnectionHeaders>):void => {
    const connection = new Connection(websocket);
    this.connections.add(connection);

    const connectingResponse = new Response().setEvent("connecting");
    connection.emit(connectingResponse);

    if(websocket.authorization) {
      const token = this.jwt.verify(websocket.authorization);
      if(!token) websocket.authorization = undefined;
    }

    const connectedResponse = new Response().setEvent("connected");
    connection.emit(connectedResponse);
  };

  public message = async (websocket:WebSocket, message:ArrayBuffer, isBinary:boolean):Promise<void> => {
    const connection = this.connections.get(websocket);
    if(!connection) return websocket.close();

    if(this.onRawMessage) return this.onRawMessage(websocket, message, isBinary);

    try {
      const payload = JSON.parse(Buffer.from(message).toString());

      const isValidMessage = Message.isMessage(payload);
      if(!isValidMessage) {
        const invalidMessageResponse = new ErrorResponse()
          .setError("invalid_message")
          .setDetail("El mensaje no es válido");

        return connection.emit(invalidMessageResponse);
      }

      if(this.messageHandler) return this.messageHandler.handle(connection, payload);
    } catch(error) {
      const unexpectedErrorResponse = new ErrorResponse()
        .setError("unexpected_error")
        .setDetail((error as Error).message);

      connection.emit(unexpectedErrorResponse);
    }
  };

  public drain = (websocket:WebSocket):void => {
    if(websocket.getBufferedAmount() < 1024 * 1024) {
      const connection = this.connections.get(websocket);
      if(!connection) return websocket.close();

      connection.overpressured = false;
      connection.sendPendingResponses();
    }
  };

  public close = (websocket:WebSocket, _code:number, _message:ArrayBuffer):void => {
    const connection = this.connections.get(websocket);
    if(!connection) return;

    connection.closed = true;
    this.connections.delete(connection.id);
  };
}
