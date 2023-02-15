import Response from "./Response";

export default class ErrorResponse extends Response {
  private error:string;
  private detail?:string;

  public constructor() {
    super();
    this.setEvent("error");
  }

  public setError(error:string):this {
    this.error = error;
    return this;
  }

  public setDetail(detail:string):this {
    this.detail = detail;
    return this;
  }
}
