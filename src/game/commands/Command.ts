import Connection from "app/components/connections/Connection";
import Message from "app/components/messages/Message";
import Precondition from "./preconditions/Precondition";

export default abstract class Command {
  protected preconditions = new Set<Precondition>();
  public abstract trigger:string;

  private async validate(connection:Connection, message:Message):Promise<true> {
    const preconditions = Array.from(this.preconditions)
      .map(precondition => precondition.validate(connection, message));

    return await Promise.all(preconditions).then(() => true);
  }

  protected abstract handle(connection:Connection, message:Message):Promise<string>;

  public async execute(connection:Connection, message:Message):Promise<string> {
    await this.validate(connection, message);
    return this.handle(connection, message);
  }
}
