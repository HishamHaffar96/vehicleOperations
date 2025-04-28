import { z } from "zod";
import { VehicleTypeResponse } from "./vehicleType.request";
import { VehicleStatus } from "@prisma/client";

export const vehicleCreateSchema = z.object({
  plateNumber: z.string().min(1).max(20),
  vehicleTypeId: z.number().int().positive(),
  VehicleStatus: z.enum(['working', 'stopped']).default('working'),
  vin: z.string().min(16).max(16),
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial();

export type VehicleCreateRequest = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdateRequest = z.infer<typeof vehicleUpdateSchema>;

export interface VehicleResponse {
  id: number;
  plateNumber: string;
  vehicleTypeId: number;
  VehicleStatus: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
  vehicleType?: VehicleTypeResponse;
}
