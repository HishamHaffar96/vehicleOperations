import fastify from 'fastify';
import pino from 'pino';
import { registerVehicleTypeRoutes } from "./routes/VehicleType.router";
import { registerOperationRoutes } from "./routes/Operation.router";
import { registerOperationVehicleRoutes } from "./routes/OperationVehicle.router";
import { registerVehicleRoutes } from "./routes/Vehicle.router";
import { registerRouteRoutes } from "./routes/Route.router";
import { registerScheduleRoutes } from "./routes/Schedule.router";

import loadConfig from './config/env.config';
import { utils } from './utils/utils';
import formbody from '@fastify/formbody';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

loadConfig();

const port = Number(process.env.API_PORT) || 5001;
const host = String(process.env.API_HOST);

const startServer = async () => {
  const server = fastify({
    logger: true,
  });

  // Register middlewares
  server.register(formbody);
  server.register(cors);
  server.register(helmet);

  // Register routes
 
  await registerVehicleTypeRoutes(server);
  await registerOperationRoutes(server);
  await registerOperationVehicleRoutes(server);
  await registerVehicleRoutes(server);
  await registerRouteRoutes(server);
  await registerScheduleRoutes(server);

  // Set error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);
    reply.status(500).send({ error: 'Something went wrong' });
  });
 // Register Swagger
 await server.register(swagger, {
  swagger: {
    info: {
      title: 'Vehicle Operations API',
      description: 'API documentation for vehicle operations',
      version: '1.0.0',
    },
    host: 'localhost:3000', 
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

await server.register(swaggerUI, {
  routePrefix: '/docs', // Swagger UI will be available at http://localhost:3000/docs
  staticCSP: true,
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});
  // Health check route
  server.get('/health', async (_request, reply) => {
    try {
      await utils.healthCheck();
      reply.status(200).send({
        message: 'Health check endpoint success.',
      });
    } catch (e) {
      reply.status(500).send({
        message: 'Health check endpoint failed.',
      });
    }
  });

  // Root route
  server.get('/', (request, reply) => {
    reply.status(200).send({ message: 'Hello from fastify boilerplate!' });
  });

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await server.close();
        server.log.error(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        server.log.error(`Error closing application on ${signal}`, err);
        process.exit(1);
      }
    });
  });

  // Start server
  try {
    await server.listen({
      port,
      host,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
