import { FastifyInstance } from "fastify";
import { OperationVehicleController } from "../controllers";
import { OperationVehicleRepository } from "../Repositories";

import { operationVehicleCreateSchema } from "../Requests";
import { MiddlewareValidation } from "../middlewares";


export async function registerOperationVehicleRoutes(fastify: FastifyInstance) {
  // Setup necessary instances

  const operationvehicleRepository = new OperationVehicleRepository();
  const operationvehicleController = new OperationVehicleController(operationvehicleRepository);

  // Bind controller methods once
  const handlers = {
    list: operationvehicleController.getAllOperationVehicles.bind(operationvehicleController),
    create: operationvehicleController.createOperationVehicle.bind(operationvehicleController),
    getById: operationvehicleController.getOperationVehicleById.bind(operationvehicleController),
    update: operationvehicleController.updateOperationVehicle.bind(operationvehicleController),
    remove: operationvehicleController.deleteOperationVehicle.bind(operationvehicleController),
  };

  // Validation middleware
  const validateCreate = MiddlewareValidation(operationVehicleCreateSchema, "body");
  const validateUpdate = MiddlewareValidation(operationVehicleCreateSchema, "body");

  // Define operationvehicle routes
  fastify.route({
    method: "GET",
    url: "/api/operationvehicles",
    handler: handlers.list,
  });

  fastify.route({
    method: "POST",
    url: "/api/operationvehicles",
    preHandler: validateCreate,
    handler: handlers.create,
  });

  fastify.route({
    method: "GET",
    url: "/api/operationvehicles/:id",
    handler: handlers.getById,
  });

  fastify.route({
    method: "PUT",
    url: "/api/operationvehicles/:id",

    preHandler: validateUpdate,
    handler: handlers.update,
  });

  fastify.route({
    method: "DELETE",
    url: "/api/operationvehicles/:id",
    handler: handlers.remove,
  });
}
