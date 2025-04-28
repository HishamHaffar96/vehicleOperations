
import { BaseHttpError } from "./BaseHttpError";
export class EntityMissingError extends BaseHttpError {
   


constructor( message: string) {
    /**
     * Constructor for EntityMissingError
     * @param {string} message - The error message
     */
    super(404,message);
   
    this.message = message;
  }
}
  