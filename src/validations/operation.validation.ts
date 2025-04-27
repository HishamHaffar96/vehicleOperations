import { z } from 'zod';
export const createOperationSchema = z.object({
    name: z.string().max(255),
    date: z.string().datetime(),
  });