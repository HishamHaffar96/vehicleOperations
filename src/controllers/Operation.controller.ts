import { FastifyRequest, FastifyReply } from "fastify";
import { OperationRepository } from "../Repositories";
import { OperationCreateRequest, OperationUpdateRequest } from "../Requests";
import { ApiResponse } from "../utils/response";
import { logger } from "../common/logger";
import { ZodError } from "zod";

export class OperationController {
  constructor(private operationRepository: OperationRepository) {}

  async getAllOperations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const operations = await this.operationRepository.findAll();
      return reply.code(200).send(ApiResponse.success(operations, "Operations retrieved successfully"));
    } catch (error) {
      logger.error("Error in getAllOperations: ", error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async getOperationById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const operation = await this.operationRepository.findById(parseInt(id));
      
      if (!operation) {
        return reply.code(404).send(ApiResponse.error("Operation not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(operation, "Operation retrieved successfully"));
    } catch (error) {
      logger.error(`Error in getOperationById for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async createOperation(
    request: FastifyRequest<{ Body: OperationCreateRequest }>,
    reply: FastifyReply
  ) {
    try {
      const operation = await this.operationRepository.create(request.body);
      return reply.code(201).send(ApiResponse.success(operation, "Operation created successfully"));
    } catch (error) {
      logger.error("Error in createOperation: ", error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async updateOperation(
    request: FastifyRequest<{
      Body: OperationUpdateRequest;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const operation = await this.operationRepository.update(
        parseInt(id),
        request.body
      );
      
      if (!operation) {
        return reply.code(404).send(ApiResponse.error("Operation not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(operation, "Operation updated successfully"));
    } catch (error) {
      logger.error(`Error in updateOperation for id ${request.params.id}: `, error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async deleteOperation(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      
      await this.operationRepository.delete(parseInt(id));
      
      
      
      return reply.code(204).send();
    } catch (error) {
      logger.error(`Error in deleteOperation for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }
}