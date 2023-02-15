import { WebSocket } from "uWebSockets.js";
import { v4 as uuid } from "uuid";
import Response from "../responses/Response";

/**
 * Representa una conexión websocket
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class Connection {
  /** Identificador único de la conexión */
  public readonly id = uuid();

  /** Socket de la conexión */
  public readonly socket:WebSocket;

  /** Respuestas pendientes de envío por overpressure */
  private pendingResponses:any[] = [];

  /** Indica si la conexión está overpressured */
  public overpressured = false;

  /** Indica si la conexión está cerrada */
  public closed = false;

  /**
   * Crea una nueva conexión
   * @param websocket Socket de la conexión
   */
  constructor(websocket:WebSocket) {
    this.socket = websocket;
  }

  /** Setea un token de autorización */
  public set authorization(authorization:string|null) {
    this.socket.authorization = authorization;
  }

  /** Obtiene el token de autorización */
  public get authorization():string | null {
    return this.socket.authorization || null;
  }

  /** Simula la emisión de un evento. */
  public emit(response:Response):void {
    if(!response.getEvent()) throw new Error("No se puede emitir un evento anónimo");
    this.send(response);
  }

  /**
   * Envia una respuesta al cliente si no está overpressured,
   * en caso contrario lo agrega a la cola de respuestas pendientes
   * @param response Respuesta a enviar
   */
  public send(response:Response):void {
    if (this.closed) return;
    if (this.overpressured) {
      this.pendingResponses.push(response);
      return;
    }

    response.setTimestamp(`${Date.now()}`);
    const buffer = this.socket.send(response.toString());

    if (buffer === 0 || buffer === 2) this.overpressured = true;
  }

  /**
   * Envía las respuestas pendientes
   * y las elimina de la cola de respuestas pendientes
   */
  public sendPendingResponses():void {
    while (this.pendingResponses.length > 0) {
      const message = this.pendingResponses.shift();
      if(this.overpressured) break;
      this.send(message);
    }
  }

  /** Cierra la conexión websocket */
  public close():void {
    if (this.closed) return;

    this.closed = true;
    this.socket.close();
  }
}
