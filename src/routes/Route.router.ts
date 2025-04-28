import { FastifyInstance } from "fastify";
import { RouteController } from "../controllers";
import { RouteRepository } from "../Repositories";

import { vehicleCreateSchema } from "../Requests";
import { MiddlewareValidation } from "../middlewares";


/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Registers all Route related routes on the Fastify server.
 *
 * @param fastify - The Fastify server instance to register the routes on.
 */
/*******  f9942715-6dad-4ee3-9fe7-0d7cfa9594f1  *******/
export async function registerRouteRoutes(fastify: FastifyInstance) {
  // Setup necessary instances

  const routeRepository = new RouteRepository();
  const routeController = new RouteController(routeRepository);

  // Bind controller methods once
  const handlers = {
    list: routeController.getAllRoutes.bind(RouteController),
    create: routeController.createRoute.bind(RouteController),
    getById: routeController.getRouteById.bind(RouteController),
    update: routeController.updateRoute.bind(RouteController),
    remove: routeController.deleteRoute.bind(RouteController),
  };

  // Validation middleware
  const validateCreate = MiddlewareValidation(vehicleCreateSchema, "body");
  const validateUpdate = MiddlewareValidation(vehicleCreateSchema, "body");

  // Define Route routes
  fastify.route({
    method: "GET",
    url: "/api/Routes",
    handler: handlers.list,
  });

  fastify.route({
    method: "POST",
    url: "/api/Routes",
    preHandler: validateCreate,
    handler: handlers.create,
  });

  fastify.route({
    method: "GET",
    url: "/api/Routes/:id",
    handler: handlers.getById,
  });

  fastify.route({
    method: "PUT",
    url: "/api/Routes/:id",

    preHandler: validateUpdate,
    handler: handlers.update,
  });

  fastify.route({
    method: "DELETE",
    url: "/api/Routes/:id",
    handler: handlers.remove,
  });
}
