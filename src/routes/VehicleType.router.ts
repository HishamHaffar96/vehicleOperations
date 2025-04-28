import { FastifyInstance } from "fastify";
import { VehicleTypeController } from "../controllers";
import { VehicleTypeRepository } from "../Repositories";

import { vehicleCreateSchema } from "../Requests";
import { MiddlewareValidation } from "../middlewares";


export async function registerVehicleTypeRoutes(fastify: FastifyInstance) {
  // Setup necessary instances

  const vehicleTypeRepository = new VehicleTypeRepository();
  const vehicleTypeController = new VehicleTypeController(vehicleTypeRepository);

  // Bind controller methods once
  const handlers = {
    list: vehicleTypeController.getAllVehicleTypes.bind(VehicleTypeController),
    create: vehicleTypeController.createVehicleType.bind(VehicleTypeController),
    getById: vehicleTypeController.getVehicleTypeById.bind(VehicleTypeController),
    update: vehicleTypeController.updateVehicleType.bind(VehicleTypeController),
    remove: vehicleTypeController.deleteVehicleType.bind(VehicleTypeController),
  };

  // Validation middleware
  const validateCreate = MiddlewareValidation(vehicleCreateSchema, "body");
  const validateUpdate = MiddlewareValidation(vehicleCreateSchema, "body");

  // Define VehicleType routes
  fastify.route({
    method: "GET",
    url: "/api/VehicleTypes",
    handler: handlers.list,
  });

  fastify.route({
    method: "POST",
    url: "/api/VehicleTypes",
    preHandler: validateCreate,
    handler: handlers.create,
  });

  fastify.route({
    method: "GET",
    url: "/api/VehicleTypes/:id",
    handler: handlers.getById,
  });

  fastify.route({
    method: "PUT",
    url: "/api/VehicleTypes/:id",

    preHandler: validateUpdate,
    handler: handlers.update,
  });

  fastify.route({
    method: "DELETE",
    url: "/api/VehicleTypes/:id",
    handler: handlers.remove,
  });
}
