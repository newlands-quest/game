import Connection from "app/components/connections/Connection";
import Message from "app/components/messages/Message";

export default interface Precondition {
  validate(connection:Connection, message:Message):Promise<true>
}
