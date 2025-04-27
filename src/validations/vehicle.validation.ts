import { z } from 'zod';
export const createVehicleSchema = z.object({
    vehicleTypeId: z.number().int(),
    vin: z.string().length(16),
    plateNumber: z.string().max(255),
  });