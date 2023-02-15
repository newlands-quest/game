/**
 * Representa una respuesta del servidor al cliente
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class Response {
  /** Momento de la respuesta */
  private timestamp:string;
  private content:string;
  private event:string;
  //[key:string]:any;

  public setTimestamp(timestamp:string):this {
    this.timestamp = timestamp;
    return this;
  }

  public setContent(content:string):this {
    this.content = content;
    return this;
  }

  public setEvent(event:string):this {
    this.event = event;
    return this;
  }

  public getEvent():string {
    return this.event;
  }

  public toString():string {
    return JSON.stringify(this);
  }
}
