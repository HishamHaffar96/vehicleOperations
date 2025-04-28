import { FastifyRequest, FastifyReply } from "fastify";
import { OperationVehicleRepository } from "../Repositories";
import { OperationVehicleCreateRequest, OperationVehicleUpdateRequest } from "../Requests";
import { ApiResponse } from "../utils/response";
import { logger } from "../common/logger";
import { ZodError } from "zod";

export class OperationVehicleController {
  constructor(private operationVehicleRepository: OperationVehicleRepository) {}

  async getAllOperationVehicles(request: FastifyRequest, reply: FastifyReply) {
    try {
      const assignments = await this.operationVehicleRepository.findAll();
      return reply.code(200).send(ApiResponse.success(assignments, "Vehicle assignments retrieved successfully"));
    } catch (error) {
      logger.error("Error in getAllOperationVehicles: ", error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async getOperationVehicleById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const assignment = await this.operationVehicleRepository.findById(parseInt(id));
      
      if (!assignment) {
        return reply.code(404).send(ApiResponse.error("Vehicle assignment not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(assignment, "Vehicle assignment retrieved successfully"));
    } catch (error) {
      logger.error(`Error in getOperationVehicleById for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async createOperationVehicle(
    request: FastifyRequest<{ Body: OperationVehicleCreateRequest }>,
    reply: FastifyReply
  ) {
    try {
      const assignment = await this.operationVehicleRepository.create(request.body);
      return reply.code(201).send(ApiResponse.success(assignment, "Vehicle assigned to operation successfully"));
    } catch (error) {
      logger.error("Error in createOperationVehicle: ", error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async updateOperationVehicle(
    request: FastifyRequest<{
      Body: OperationVehicleUpdateRequest;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const assignment = await this.operationVehicleRepository.update(
        parseInt(id),
        request.body
      );
      
      if (!assignment) {
        return reply.code(404).send(ApiResponse.error("Vehicle assignment not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(assignment, "Vehicle assignment updated successfully"));
    } catch (error) {
      logger.error(`Error in updateOperationVehicle for id ${request.params.id}: `, error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async deleteOperationVehicle(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      
      await this.operationVehicleRepository.delete(parseInt(id));
      
     
      
      return reply.code(204).send();
    } catch (error) {
      logger.error(`Error in deleteOperationVehicle for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }
}