import { FastifyRequest, FastifyReply } from "fastify";
import { VehicleRepository } from "../Repositories";
import { VehicleCreateRequest, VehicleUpdateRequest } from "../Requests";
import { ApiResponse } from "../utils/response";
import { logger } from "../common/logger";
import { ZodError } from "zod";

export class VehicleController {
  constructor(private vehicleRepository: VehicleRepository) {}

  async getAllVehicles(request: FastifyRequest, reply: FastifyReply) {
    try {
      const vehicles = await this.vehicleRepository.findAll();
      return reply.code(200).send(ApiResponse.success(vehicles, "Vehicles retrieved successfully"));
    } catch (error) {
      logger.error("Error in getAllVehicles: ", error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async getVehicleById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const vehicle = await this.vehicleRepository.findById(parseInt(id));
      
      if (!vehicle) {
        return reply.code(404).send(ApiResponse.error("Vehicle not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(vehicle, "Vehicle retrieved successfully"));
    } catch (error) {
      logger.error(`Error in getVehicleById for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async createVehicle(
    request: FastifyRequest<{ Body: VehicleCreateRequest }>,
    reply: FastifyReply
  ) {
    try {
      const vehicle = await this.vehicleRepository.create(request.body);
      return reply.code(201).send(ApiResponse.success(vehicle, "Vehicle created successfully"));
    } catch (error) {
      logger.error("Error in createVehicle: ", error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async updateVehicle(
    request: FastifyRequest<{
      Body: VehicleUpdateRequest;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const vehicle = await this.vehicleRepository.update(
        parseInt(id),
        request.body
      );
      
      if (!vehicle) {
        return reply.code(404).send(ApiResponse.error("Vehicle not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(vehicle, "Vehicle updated successfully"));
    } catch (error) {
      logger.error(`Error in updateVehicle for id ${request.params.id}: `, error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async deleteVehicle(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      await this.vehicleRepository.delete(parseInt(id));
      
      
      return reply.code(204).send();
    } catch (error) {
      logger.error(`Error in deleteVehicle for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }
}