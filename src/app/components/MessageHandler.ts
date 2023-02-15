import Connection from "./connections/Connection";
import Message from "./messages/Message";

export default interface MessageHandler {
  handle(connection:Connection, message:Message):Promise<void>
}
