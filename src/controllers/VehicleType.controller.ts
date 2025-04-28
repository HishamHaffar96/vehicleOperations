import { FastifyRequest, FastifyReply } from "fastify";
import { VehicleTypeRepository } from "../Repositories";
import { VehicleTypeCreateRequest, VehicleTypeUpdateRequest } from "../Requests";
import { ApiResponse } from "../utils/response";
import { logger } from "../common/logger";
import { ZodError } from 'zod';


export class VehicleTypeController {
  constructor(private vehicleTypeRepositor: VehicleTypeRepository) {}

  async getAllVehicleTypes(request: FastifyRequest, reply: FastifyReply) {
    try {
      const vehicleTypes = await this.vehicleTypeRepositor.findAll();
      return reply.code(200).send(ApiResponse.success(vehicleTypes, "Vehicle types retrieved successfully"));
    } catch (error) {
      logger.error("Error in getAllVehicleTypes: ", error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async getVehicleTypeById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const vehicleType = await this.vehicleTypeRepositor.findById(parseInt(id));
      
      if (!vehicleType) {
        return reply.code(404).send(ApiResponse.error("Vehicle type not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(vehicleType, "Vehicle type retrieved successfully"));
    } catch (error) {
      logger.error(`Error in getVehicleTypeById for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async createVehicleType(
    request: FastifyRequest<{ Body: VehicleTypeCreateRequest }>,
    reply: FastifyReply
  ) {
    try {
      const vehicleType = await this.vehicleTypeRepositor.create(request.body);
      return reply.code(201).send(ApiResponse.success(vehicleType, "Vehicle type created successfully"));
    } catch (error) {
      logger.error("Error in createVehicleType: ", error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async updateVehicleType(
    request: FastifyRequest<{
      Body: VehicleTypeUpdateRequest;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const vehicleType = await this.vehicleTypeRepositor.update(
        parseInt(id),
        request.body
      );
      
      if (!vehicleType) {
        return reply.code(404).send(ApiResponse.error("Vehicle type not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(vehicleType, "Vehicle type updated successfully"));
    } catch (error) {
      logger.error(`Error in updateVehicleType for id ${request.params.id}: `, error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async deleteVehicleType(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
       await this.vehicleTypeRepositor.delete(parseInt(id));
    
      
      return reply.code(204).send();
    } catch (error) {
      logger.error(`Error in deleteVehicleType for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }
}