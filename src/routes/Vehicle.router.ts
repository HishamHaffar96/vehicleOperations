import { FastifyInstance } from "fastify";
import { VehicleController } from "../controllers";
import { VehicleRepository } from "../Repositories";

import { MiddlewareValidation } from "../middlewares";
import { vehicleCreateSchema, vehicleUpdateSchema } from "../Requests";



export async function registerVehicleRoutes(fastify: FastifyInstance) {
  // Setup necessary instances

  const vehicleRepository = new VehicleRepository();
  const vehicleController = new VehicleController(vehicleRepository);

  // Bind controller methods once
  const handlers = {
    list: vehicleController.getAllVehicles.bind(VehicleController),
    create: vehicleController.createVehicle.bind(VehicleController),
    getById: vehicleController.getVehicleById.bind(VehicleController),
    update: vehicleController.updateVehicle.bind(VehicleController),
    remove: vehicleController.deleteVehicle.bind(VehicleController),
  };

  // Validation middleware
  const validateCreate = MiddlewareValidation(vehicleCreateSchema, "body");
  const validateUpdate = MiddlewareValidation(vehicleUpdateSchema, "body");

  // Define Vehicle routes
  fastify.route({
    method: "GET",
    url: "/api/Vehicles",
    handler: handlers.list,
  });

  fastify.route({
    method: "POST",
    url: "/api/Vehicles",
    preHandler: validateCreate,
    handler: handlers.create,
  });

  fastify.route({
    method: "GET",
    url: "/api/Vehicles/:id",
    handler: handlers.getById,
  });

  fastify.route({
    method: "PUT",
    url: "/api/Vehicles/:id",

    preHandler: validateUpdate,
    handler: handlers.update,
  });

  fastify.route({
    method: "DELETE",
    url: "/api/Vehicles/:id",
    handler: handlers.remove,
  });
}
