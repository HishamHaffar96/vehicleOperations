export class ApiResponse {
    /**
     * Return a successful API response
     *
     * @template T
     * @param {T} data response data
     * @param {string} [message='Request successful'] response message
     * @returns {ApiResponse<T>}
     */
    static success<T>(data: T, message = 'Request successful') {
      return {
        success: true,
        message,
        data,
      };
    }
  
    /**
     * Return a standard error response object
     * @param {string} [message='Something went wrong'] The error message
     * @param {any} [data=null] Optional data to be sent with the error response
     * @returns {object} The error response object
     */
    static error(message = 'Something went wrong', data: any = null) {
      return {
        success: false,
        message,
        data,
      };
    }
  }