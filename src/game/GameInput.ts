import Connection from "app/components/connections/Connection";
import MessageHandler from "app/components/MessageHandler";
import Message from "app/components/messages/Message";
import Command from "./commands/Command";
import GameOutput from "./GameOutput";

export default class GameInput implements MessageHandler {
  private commands = new Map<string, Command>();
  private gameOutput = new GameOutput();

  private parseCommand(content:string):string {
    return content.split(" ")[0];
  }

  public addCommand(command:Command):this {
    this.commands.set(command.trigger, command);
    return this;
  }

  public addCommands(commands:Command[]):this {
    commands.forEach(command => this.addCommand(command));
    return this;
  }

  public removeCommand(command:Command):void {
    this.commands.delete(command.trigger);
  }

  public async handle(connection:Connection, message:Message):Promise<void> {
    const command = this.parseCommand(message.content);

    const commandHandler = this.commands.get(command);
    if(!commandHandler) return;

    const response = await commandHandler.execute(connection, message);
    await this.gameOutput.send(connection, response);
  }
}
