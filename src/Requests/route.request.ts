import { z } from "zod";
import { ScheduleResponse } from "./schedule.request";

export const routeCreateSchema = z.object({
    source: z.object({
    x: z.number(),
    y: z.number(),
  }),
  destination:  z.object({
    x: z.number(),
    y: z.number(),
  }),
  vehicleTypeId: z.number().int().positive(),
  distance: z.number().positive(),
  durationInSec: z.number().int().positive(),
});

export const routeUpdateSchema = routeCreateSchema.partial();

export type RouteCreateRequest = z.infer<typeof routeCreateSchema>;
export type RouteUpdateRequest = z.infer<typeof routeUpdateSchema>;

export interface RouteResponse {
  id: number;
  source: string;
  destination: string;
  distance: number;
  durationInSec: number;
  createdAt: Date;
  updatedAt: Date;
  schedules?: ScheduleResponse[];
}
