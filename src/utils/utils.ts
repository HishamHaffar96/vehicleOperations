import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import * as JWT from 'jsonwebtoken';
import Joi from 'joi';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export const prisma = new PrismaClient();

export const utils = {
  isJSON: (data: string) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  },

  getTime: (): number => {
    return new Date().getTime();
  },

  genSalt: (saltRounds: number, value: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return reject(err);
        bcrypt.hash(value, salt, (err, hash) => {
          if (err) return reject(err);
          resolve(hash);
        });
      });
    });
  },

  compareHash: (hash: string, value: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(value, hash, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  healthCheck: async (): Promise<void> => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      throw new Error(`Health check failed: ${e.message}`);
    }
  },

  getTokenFromHeader: (
    authorizationHeader: string | undefined,
  ): string | null => {
    if (!authorizationHeader) return null;
    const token = authorizationHeader.replace('Bearer ', '');
    return token || null;
  },

  verifyToken: (token: string): any => {
    try {
      return JWT.verify(token, process.env.APP_JWT_SECRET as string);
    } catch (err) {
      return null;
    }
  },

  validateSchema: (schema: Joi.ObjectSchema) => {
    return (data: any) => {
      const { error } = schema.validate(data);
      if (error) {
        throw new Error(error.details[0].message);
      }
    };
  },


   preValidation : (schema) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // This is likely where the error comes from, replacing validate() with parse()
        const parsedBody = schema.parse(request.body);
        request.body = parsedBody; // Make sure to set the validated data on the request
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            success: false,
            message: 'Validation error',
            data: error.errors,
          });
        }
        return reply.status(500).send({
          success: false,
          message: 'Internal Server Error',
          data: error.message,
        });
      }
    }
  }
  };

