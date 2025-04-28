import { z } from "zod";
export const scheduleCreateSchema = z.object({
  vehicleTypeId: z.number().int().positive(),
  routeId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  activeDays: z.array(z.number().min(0).max(6)), // Array of numbers 0-6 representing days
});

export const scheduleUpdateSchema = scheduleCreateSchema.partial();

export type ScheduleCreateRequest = z.infer<typeof scheduleCreateSchema>;
export type ScheduleUpdateRequest = z.infer<typeof scheduleUpdateSchema>;

export interface ScheduleResponse {
  id: number;
  vehicleTypeId: number;
  routeId: number;
  startTime: Date;
  endTime: Date;
  activeDays: number[];
  vehicleType?: {
    id: number;
    name: string;
    description: string | null;
  };
  route?: {
    id: number;
    source: string;
    destination: string;
    distance: number;
    duration: number;
  };
  createdAt: Date;
  updatedAt: Date;
}