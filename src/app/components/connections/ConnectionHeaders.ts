export interface ConnectionHeaders {
  url:string;
  authorization:string;
}

/**
 * Headers de la conexión socket
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class ConnectionHeadersBuilder {
  /** URL */
  public url:string;
  /** JWT token */
  public authorization:string;

  public setUrl(url:string):this {
    this.url = url;
    return this;
  }

  public setAuthorization(authorization:string):this {
    this.authorization = authorization;
    return this;
  }

  public build() {
    return {
      url: this.url,
      authorization: this.authorization,
    };
  }
}
