import jwt from "jsonwebtoken";

/**
 * Singleton clase de utilidad para el manejo de JWT
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class JWT {
  private static instance:JWT;
  /** Clave secreta */
  private secret:any;

  private constructor() {
    this.secret = process.env.JWT_SECRET;
  }

  public static getInstance():JWT {
    if(!JWT.instance) JWT.instance = new JWT();
    return JWT.instance;
  }

  /** Setea un nuevo secret para encriptar y desencriptar */
  public setSecret(secret:string):void {
    this.secret = secret;
  }

  /** Firma el código y retorna un JWT */
  public sign(payload:string|object|Buffer):string {
    return jwt.sign(payload, this.secret, { expiresIn: "47h" });
  }

  /** Verifica el token y retorna el payload decodificado */
  public verify(token:string):object | null {
    const parsedToken = token.replace("Bearer ", "");

    return jwt.verify(parsedToken, this.secret, (error, decoded) => {
      if(error) {
        if(error.name === "TokenExpiredError") return null;
        else return null;
      } return decoded;
    }) as unknown as object;
  }
}
