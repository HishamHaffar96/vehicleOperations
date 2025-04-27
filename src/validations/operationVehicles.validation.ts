import { z } from 'zod';
export const createOperationVehiclesSchema = z.object({
    operationId: z.number().int(),
    vehicleTypeId: z.number().int(),
    quantity: z.number().int().positive(),
  });