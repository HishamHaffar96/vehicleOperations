import { Vehicle } from "@prisma/client";
import { VehicleCreateRequest, VehicleUpdateRequest } from "../Requests";
import { prisma } from '../../prisma/client';
import { EntityMissingError } from "../common/exceptions/EntityMissingError";

export interface IVehicleRepository {
  findAll(): Promise<Vehicle[]>;
  findById(id: number): Promise<Vehicle>;
  create(data: VehicleCreateRequest): Promise<Vehicle>;
  update(id: number, data: VehicleUpdateRequest): Promise<Vehicle>;
  delete(id: number): Promise<void>;
}

export class VehicleRepository implements IVehicleRepository {
  constructor() {}

  async findAll(): Promise<Vehicle[]> {
    return prisma.vehicle.findMany();
  }

  async findById(id: number): Promise<Vehicle> {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new EntityMissingError("Vehicle not found");
    }
    return vehicle;
  }

  async create(data: VehicleCreateRequest): Promise<Vehicle> {
    return prisma.vehicle.create({
      data: {
        vin: data.vin,
        plateNumber: data.plateNumber,
        vehicleTypeId: data.vehicleTypeId,
        VehicleStatus: data.VehicleStatus || 'working',
      },
    });
  }

  async update(id: number, data: VehicleUpdateRequest): Promise<Vehicle> {
    await this.findById(id);
    return prisma.vehicle.update({
      where: { id },
      data: {
        plateNumber: data.plateNumber,
        vehicleTypeId: data.vehicleTypeId,
        VehicleStatus: data.VehicleStatus,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await prisma.vehicle.delete({
      where: { id },
    });
  }
}