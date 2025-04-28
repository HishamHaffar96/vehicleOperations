
import { BaseHttpError } from "./BaseHttpError";
export class AccessDeniedError extends BaseHttpError {
   


constructor( message: string) {
    /**
     * Constructor for AccessDeniedError
     * @param {string} message - The error message
     */
    super(403,message);
    this.message = message;
  }
}