import Connection from "app/components/connections/Connection";
import Message from "app/components/messages/Message";
import Command from "./Command";

export default class RegisterCommand extends Command {
  public trigger = "register";

  protected handle(connection:Connection, message:Message):Promise<string> {
    throw new Error("Method not implemented.");
  }

}
