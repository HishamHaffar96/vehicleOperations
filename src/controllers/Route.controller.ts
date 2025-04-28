import { FastifyRequest, FastifyReply } from "fastify";
import { RouteRepository } from "../Repositories";
import { RouteCreateRequest, RouteUpdateRequest } from "../Requests";
import { ApiResponse } from "../utils/response";
import { logger } from "../common/logger";
import { ZodError } from "zod";
export class RouteController {
  constructor(private routeRepository: RouteRepository) {}

  async getAllRoutes(request: FastifyRequest, reply: FastifyReply) {
    try {
      const routes = await this.routeRepository.findAll();
      return reply.code(200).send(ApiResponse.success(routes, "Routes retrieved successfully"));
    } catch (error) {
      logger.error("Error in getAllRoutes: ", error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async getRouteById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const route = await this.routeRepository.findById(parseInt(id));
      
      if (!route) {
        return reply.code(404).send(ApiResponse.error("Route not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(route, "Route retrieved successfully"));
    } catch (error) {
      logger.error(`Error in getRouteById for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async createRoute(
    request: FastifyRequest<{ Body: RouteCreateRequest }>,
    reply: FastifyReply
  ) {
    try {
      const route = await this.routeRepository.create(request.body);
      return reply.code(201).send(ApiResponse.success(route, "Route created successfully"));
    } catch (error) {
      logger.error("Error in createRoute: ", error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async updateRoute(
    request: FastifyRequest<{
      Body: RouteUpdateRequest;
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const route = await this.routeRepository.update(
        parseInt(id),
        request.body
      );
      
      if (!route) {
        return reply.code(404).send(ApiResponse.error("Route not found"));
      }
      
      return reply.code(200).send(ApiResponse.success(route, "Route updated successfully"));
    } catch (error) {
      logger.error(`Error in updateRoute for id ${request.params.id}: `, error);
      
      if (error instanceof ZodError) {
        return reply.code(400).send(ApiResponse.error("Validation Error", error.errors));
      }
      
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }

  async deleteRoute(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      await this.routeRepository.delete(parseInt(id));
      
     
      
      return reply.code(204).send();
    } catch (error) {
      logger.error(`Error in deleteRoute for id ${request.params.id}: `, error);
      return reply.code(500).send(ApiResponse.error("Internal Server Error"));
    }
  }
}