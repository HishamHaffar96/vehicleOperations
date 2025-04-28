import { FastifyInstance } from "fastify";
import { OperationController } from "../controllers";
import { OperationRepository } from "../Repositories";

import { operationUpdateSchema } from "../Requests";
import { MiddlewareValidation } from "../middlewares";


export async function registerOperationRoutes(fastify: FastifyInstance) {
  // Setup necessary instances

  const operationRepository = new OperationRepository();
  const operationController = new OperationController(operationRepository);

  // Bind controller methods once
  const handlers = {
    list: operationController.getAllOperations.bind(operationController),
    create: operationController.createOperation.bind(operationController),
    getById: operationController.getOperationById.bind(operationController),
    update: operationController.updateOperation.bind(operationController),
    remove: operationController.deleteOperation.bind(operationController),
  };

  // Validation middleware
  const validateCreate = MiddlewareValidation(operationUpdateSchema, "body");
  const validateUpdate = MiddlewareValidation(operationUpdateSchema, "body");

  // Define operation routes
  fastify.route({
    method: "GET",
    url: "/api/operations",
    handler: handlers.list,
  });

  fastify.route({
    method: "POST",
    url: "/api/operations",
    preHandler: validateCreate,
    handler: handlers.create,
  });

  fastify.route({
    method: "GET",
    url: "/api/operations/:id",
    handler: handlers.getById,
  });

  fastify.route({
    method: "PUT",
    url: "/api/operations/:id",

    preHandler: validateUpdate,
    handler: handlers.update,
  });

  fastify.route({
    method: "DELETE",
    url: "/api/operations/:id",
    handler: handlers.remove,
  });
}
