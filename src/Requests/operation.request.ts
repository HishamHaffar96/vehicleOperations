import { OperationStatus, OperationVehicle } from "@prisma/client";
import { z } from "zod";
export const operationCreateSchema = z.object({
  name: z.string().min(1).max(255),
  date: z.string().datetime(),
  operationStatus: z.enum(['active', 'canceled','completed']).default('completed'),
 
});

export const operationUpdateSchema = operationCreateSchema.partial();

export type OperationCreateRequest = z.infer<typeof operationCreateSchema>;
export type OperationUpdateRequest = z.infer<typeof operationUpdateSchema>;

export interface OperationResponse {
  id: number;
  name: string;
  date: Date | null;
  operationStatus: OperationStatus;
  createdAt: Date;
  updatedAt: Date;
  operationVehicles?: OperationVehicle[]
}