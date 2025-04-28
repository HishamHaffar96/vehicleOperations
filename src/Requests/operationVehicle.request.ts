import { Operation } from "@prisma/client";
import { z } from "zod";
import { VehicleResponse } from "./vehicle.request";

export const operationVehicleCreateSchema = z.object({
  operationId: z.number().int().positive(),
  vehicleId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const operationVehicleUpdateSchema = operationVehicleCreateSchema.partial();

export type OperationVehicleCreateRequest = z.infer<typeof operationVehicleCreateSchema>;
export type OperationVehicleUpdateRequest = z.infer<typeof operationVehicleUpdateSchema>;

export interface OperationVehicleResponse {
  id: number;
  operationId: number;
  vehicleTypeId: number;
  quantity:number;
  operation?: Operation;
  vehicle?: VehicleResponse;
}