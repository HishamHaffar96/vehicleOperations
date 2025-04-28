
import { BaseHttpError } from "./BaseHttpError";
export class ConflictError extends BaseHttpError {
   


constructor( message: string) {
    /**
     * Constructor for ConflictError
     * @param {string} message - The error message
     */
    super(409,message);
    this.message = message;
  }
}