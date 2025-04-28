import { FastifyInstance } from "fastify";
import { ScheduleController } from "../controllers";
import { ScheduleRepository } from "../Repositories";

import { scheduleCreateSchema } from "../Requests";
import { MiddlewareValidation } from "../middlewares";


export async function registerScheduleRoutes(fastify: FastifyInstance) {
  // Setup necessary instances

  const scheduleRepository = new ScheduleRepository();
  const scheduleController = new ScheduleController(scheduleRepository);

  // Bind controller methods once
  const handlers = {
    list: scheduleController.getAllSchedules.bind(ScheduleController),
    create: scheduleController.createSchedule.bind(ScheduleController),
    getById: scheduleController.getScheduleById.bind(ScheduleController),
    update: scheduleController.updateSchedule.bind(ScheduleController),
    remove: scheduleController.deleteSchedule.bind(ScheduleController),
  };

  // Validation middleware
  const validateCreate = MiddlewareValidation(scheduleCreateSchema, "body");
  const validateUpdate = MiddlewareValidation(scheduleCreateSchema, "body");

  // Define Schedule routes
  fastify.route({
    method: "GET",
    url: "/api/Schedules",
    handler: handlers.list,
  });

  fastify.route({
    method: "POST",
    url: "/api/Schedules",
    preHandler: validateCreate,
    handler: handlers.create,
  });

  fastify.route({
    method: "GET",
    url: "/api/Schedules/:id",
    handler: handlers.getById,
  });

  fastify.route({
    method: "PUT",
    url: "/api/Schedules/:id",

    preHandler: validateUpdate,
    handler: handlers.update,
  });

  fastify.route({
    method: "DELETE",
    url: "/api/Schedules/:id",
    handler: handlers.remove,
  });
}
