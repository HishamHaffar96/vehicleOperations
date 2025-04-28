import { Route } from "@prisma/client";
import { RouteCreateRequest, RouteUpdateRequest } from "../Requests";
import { prisma } from '../../prisma/client';
import { EntityMissingError } from "../common/exceptions/EntityMissingError";

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route>;
  create(data: RouteCreateRequest): Promise<Route>;
  update(id: number, data: RouteUpdateRequest): Promise<Route>;
  delete(id: number): Promise<void>;
}

export class RouteRepository implements IRouteRepository {
  constructor() {}

  async findAll(): Promise<Route[]> {
    return prisma.route.findMany();
  }

  async findById(id: number): Promise<Route> {
    const route = await prisma.route.findUnique({ where: { id } });
    if (!route) {
      throw new EntityMissingError("Route not found");
    }
    return route;
  }

  async create(data: RouteCreateRequest): Promise<Route> {
    return prisma.route.create({
      data: {
        vehicleTypeId: data.vehicleTypeId,

        source: data.source,
        destination:data.destination,
        distance: data.distance,
        durationInSec: data.durationInSec,
      },
    });
  }

  async update(id: number, data: RouteUpdateRequest): Promise<Route> {
    await this.findById(id);
    return prisma.route.update({
      where: { id },
      data: {
        vehicleTypeId: data.vehicleTypeId,
        source: data.source,
        destination:data.destination,
        distance: data.distance,
        durationInSec: data.durationInSec,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await prisma.route.delete({
      where: { id },
    });
  }
}