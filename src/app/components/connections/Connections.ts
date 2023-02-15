import Connection from "./Connection";
import { WebSocket } from "uWebSockets.js";

/**
 * Manager de conexiones websocket activas
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class Connections {
  private storage = new Map<string, Connection>();

  /**
   * Busca una conexión a partir de una instancia de WebSockets
   * @param socket Instancia de WebSockets
   */
  private findBySocket(socket:WebSocket):Connection | null {
    let foundConnection:Connection | null = null;
    this.storage.forEach(thisConnection => foundConnection = thisConnection.socket === socket ? thisConnection : null);
    return foundConnection;
  }

  /** Obtiene el total de conexiones activas */
  public size():number {
    return this.storage.size;
  }

  /** Cierra todas las conexiones activas */
  public clear():void {
    this.storage.forEach(thisConnection => thisConnection.close());
    this.storage.clear();
  }

  /**
   * Obtiene una conexión a partir de su identificador único
   * @param id Identificador único de la conexión
   */
  public get(id:string):Connection | null;
  /**
   * Obtiene una conexión a partir de una instancia de WebSockets
   * @param socket Instancia de WebSockets
   */
  public get(socket:WebSocket):Connection | null;
  public get(key:any):Connection | null {
    if(typeof key === "string") return this.storage.get(key) || null;
    return this.findBySocket(key);
  }

  /**
   * Comprueba si existe una conexión a partir de su identificador único
   * @param id Identificador único de la conexión
  */
  public exists(id:string):boolean;
  /**f
   * Comprueba si existe una conexión a partir de una instancia de WebSockets
   * @param socket Instancia de WebSockets
   */
  public exists(socket:WebSocket):boolean;
  public exists(key:any):boolean {
    if(typeof key === "string") return this.storage.has(key);
    else return this.findBySocket(key) !== null;
  }

  /**
   * Añade una conexión a la lista de conexiones activas
   * @param connection Conexión a añadir
   */
  public add(connection:Connection):void {
    if(this.exists(connection.id)) this.delete(connection.id);
    this.storage.set(connection.id, connection);
  }

  /**
   * Elimina y cierra una conexión a partir de su identificador único
   * @param id Identificador único de la conexión
   */
  public delete(id:string):void;
  /**
   * Elimina y cierra una conexión a partir de una instancia de WebSockets
   * @param socket Instancia de WebSockets
   */
  public delete(socket:WebSocket):void;
  public delete(key:any):void {
    const exists = this.exists(key);
    if(exists) {
      const existingConnection = this.get(key) as Connection;
      if(!existingConnection.closed) existingConnection.close();

      const identifier = typeof key === "string" ? key : existingConnection.id;
      this.storage.delete(identifier);
    }
  }

}
