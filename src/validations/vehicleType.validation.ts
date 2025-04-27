import { z } from 'zod';

export const createVehicleTypeSchema = z.object({
  name: z.string().max(255),
});