import Connection from "app/components/connections/Connection";
import Response from "app/components/responses/Response";

export default class GameOutput {

  public async send(connection:Connection, content:string) {
    const response = new Response();
    response.setContent(content);

    connection.send(response);
  }
}
