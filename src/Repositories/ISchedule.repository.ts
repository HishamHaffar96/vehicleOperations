import { Schedule } from "@prisma/client";
import { ScheduleCreateRequest, ScheduleUpdateRequest } from "../Requests";
import { prisma } from '../../prisma/client';
import { EntityMissingError } from "../common/exceptions/EntityMissingError";

export interface IScheduleRepository {
  findAll(): Promise<Schedule[]>;
  findById(id: number): Promise<Schedule>;
  create(data: ScheduleCreateRequest): Promise<Schedule>;
  update(id: number, data: ScheduleUpdateRequest): Promise<Schedule>;
  delete(id: number): Promise<void>;
}

export class ScheduleRepository implements IScheduleRepository {
  constructor() {}

  async findAll(): Promise<Schedule[]> {
    return prisma.schedule.findMany();
  }

  async findById(id: number): Promise<Schedule> {
    const schedule = await prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      throw new EntityMissingError("Schedule not found");
    }
    return schedule;
  }

  async create(data: ScheduleCreateRequest): Promise<Schedule> {
    return prisma.schedule.create({
      data: {
        vehicleTypeId: data.vehicleTypeId,
        routeId: data.routeId,
        startTime: data.startTime,
        endTime: data.endTime,
        activeDays: data.activeDays,
      },
    });
  }

  async update(id: number, data: ScheduleUpdateRequest): Promise<Schedule> {
    await this.findById(id);
    return prisma.schedule.update({
      where: { id },
      data: {
        vehicleTypeId: data.vehicleTypeId,
        routeId: data.routeId,
        startTime: data.startTime,
        endTime: data.endTime,
        activeDays: data.activeDays,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await prisma.schedule.delete({
      where: { id },
    });
  }
}