import bcrypt from "bcryptjs";
import Random from "./Random";

/**
 * Wrapper class para bcryptjs basado en promesas
 * @author Lottie <enzodiazdev@gmail.com>
 */
export default class Bcrypt {
  private static randomizeRounds():number {
    return Random.uint8(10, 30);
  }

  /**
   * Hashea un string con un número de rondas determinado
   * @param data cualquier cadena de texto a hashear
   */
  public static encrypt(data:string):Promise<string> {
    const rounds = Bcrypt.randomizeRounds();

    return new Promise((resolve, reject) => {
      bcrypt.genSalt(rounds, (error:Error, salt:string) => {
        if(error) return reject(error);

        bcrypt.hash(data, salt, (error:Error, hash:string) => {
          if(error) return reject(error);
          return resolve(hash);
        });
      });
    });
  }

  /**
   * Compara un string con un hash
   * @param data cualquier cadena de texto a comparar
   * @param hash hash a comparar
   */
  public static compare(data:string, hash:string):Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data, hash, (error:Error, result:boolean) => {
        if(error) return reject(error);
        return resolve(result);
      });
    });
  }
}
