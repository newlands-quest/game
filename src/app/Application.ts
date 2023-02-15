
import * as UWS from "uWebSockets.js";
import Space from "./components/Space";
import ApplicationOptions from "./components/types/ApplicationOptions";

/**
 * Representa toda la aplicación
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class Application {
  private instance:UWS.TemplatedApp;

  constructor(options?:ApplicationOptions) {
    if(options) this.instance = UWS.SSLApp(options);
    else this.instance = UWS.App();
  }

  /** Añade una nueva instanciad e aplicación */
  public addSpace(space:Space):void {
    this.instance.ws(space.path, space);
  }

  /** Inicia la aplicación en el puerto indicado con un comportamiento opcional */
  public listen(port:number, callback?:(token:UWS.us_listen_socket) => void):void {
    this.instance.listen(port, token => {
      if(callback) return callback(token);
      if(token) console.log(`WS listening on port ${port}`);
      else console.log(`WS was failed trying to listen port ${port}`);
    });
  }
}
