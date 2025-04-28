
import { BaseHttpError } from "./BaseHttpError";
export class InvalidInputError extends BaseHttpError {
   


constructor( message: string) {
    /**
     * Constructor for InvalidInputError
     * @param {string} message - The error message
     */
    super(400,message);
    this.message = message;
  }
}