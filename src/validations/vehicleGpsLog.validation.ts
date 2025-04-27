import { z } from 'zod';
export const createVehicleGpsLogSchema = z.object({
    vehicleId: z.number().int(),
    speed: z.number().optional(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    battery: z.number().int().optional(),
    direction: z.number().min(0).max(360).optional(),
    acc: z.boolean().optional(),
    charging: z.boolean().optional(),
  });