if(process.env.NODE_ENV !== "production") require("dotenv").config();
import LoginCommand from "game/commands/LoginCommand";
import RegisterCommand from "game/commands/RegisterCommand";
import GameInput from "game/GameInput";
import Application from "./app/Application";
import Space from "./app/components/Space";
class Main {
  public static main():void {
    const app = new Application();

    const space = new Space("/*");
    const gameInput = new GameInput();
    gameInput.addCommand(new RegisterCommand())
      .addCommand(new LoginCommand());

    space.messageHandler = gameInput;

    app.addSpace(space);
    app.listen(3000);
  }
}

Main.main();
