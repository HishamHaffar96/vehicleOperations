import { z } from "zod";

// Validation schema
export const vehicleTypeCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const vehicleTypeUpdateSchema = vehicleTypeCreateSchema;

// Request
export type VehicleTypeCreateRequest = z.infer<typeof vehicleTypeCreateSchema>;
export type VehicleTypeUpdateRequest = z.infer<typeof vehicleTypeUpdateSchema>;

export interface VehicleTypeResponse {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
