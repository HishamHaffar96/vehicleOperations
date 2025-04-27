import { z } from 'zod';
export const createRouteSchema = z.object({
    vehicleTypeId: z.number().int(),
    source: z.object({
      x: z.number(),
      y: z.number(),
    }),
    destination: z.object({
      x: z.number(),
      y: z.number(),
    }),
    durationInSec: z.number().int().optional(),
    distance: z.number().optional(),
  });