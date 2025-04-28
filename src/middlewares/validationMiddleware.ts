import { FastifyRequest, FastifyReply } from "fastify";
import { ZodSchema } from "zod";
import { InvalidInputError } from "../common/exceptions";

type ValidationType = "body" | "params" | "query";

export function MiddlewareValidation(
  schema: ZodSchema,
  type: ValidationType = "body"
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = request[type];
      const result = await schema.parseAsync(data);

      // Replace the original data with the validated data
      request[type] = result;
    } catch (error: any) {
      throw new InvalidInputError(`Validation failed: ${error.message}`);
    }
  };
}
