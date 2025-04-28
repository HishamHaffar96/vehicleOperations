import { FastifyRequest, FastifyReply } from "fastify";
import { ScheduleRepository } from "../Repositories";
import { ScheduleCreateRequest, ScheduleUpdateRequest } from "../Requests";
import { ApiResponse } from "../utils/response";
import { logger } from "../common/logger";
import { ZodError } from 'zod';


export class ScheduleController {
  constructor(private scheduleRepositor: ScheduleRepository) {}

  async getAllSchedules(request: FastifyRequest, reply: FastifyReply) {
    try {
      const schedules = await this.scheduleRepositor.findAll();
      return reply.code(200).send(ApiResponse.success(schedules, "Schedule types retrieved successfully"));
    } catch (error) {
      logger.error("Error in getAllSchedules: ", error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async getScheduleById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const schedule = await this.scheduleRepositor.findById(parseInt(id));
      
      if (!schedule) {
        return reply.code(404).send(ApiResponse.error("Schedule type not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(schedule, "Schedule type retrieved successfully"));
    } catch (error) {
      logger.error(`Error in getScheduleById for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async createSchedule(
    request: FastifyRequest<{ Body: ScheduleCreateRequest }>,
    reply: FastifyReply
  ) {
    try {
      const schedule = await this.scheduleRepositor.create(request.body);
      return reply.code(201).send(ApiResponse.success(schedule, "Schedule type created successfully"));
    } catch (error) {
      logger.error("Error in createSchedule: ", error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async updateSchedule(
    request: FastifyRequest<{
      Body: ScheduleUpdateRequest;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const schedule = await this.scheduleRepositor.update(
        parseInt(id),
        request.body
      );
      
      if (!schedule) {
        return reply.code(404).send(ApiResponse.error("Schedule type not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(schedule, "Schedule type updated successfully"));
    } catch (error) {
      logger.error(`Error in updateSchedule for id ${request.params.id}: `, error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async deleteSchedule(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
       await this.scheduleRepositor.delete(parseInt(id));
    
      
      return reply.code(204).send();
    } catch (error) {
      logger.error(`Error in deleteSchedule for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }
}