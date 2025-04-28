
import { BaseHttpError } from "./BaseHttpError";
export class AuthRequiredError extends BaseHttpError {
   


constructor( message: string) {
    /**
     * Constructor for AuthRequiredError
     * @param {string} message - The error message
     */
    super(401,message);
    this.message = message;
  }
}