import { OperationVehicle } from "@prisma/client";
import { OperationVehicleCreateRequest, OperationVehicleUpdateRequest } from "../Requests";
import { prisma } from '../../prisma/client';
import { EntityMissingError } from "../common/exceptions/EntityMissingError";

export interface IOperationVehicleRepository {
  findAll(): Promise<OperationVehicle[]>;
  findById(id: number): Promise<OperationVehicle>;
  create(data: OperationVehicleCreateRequest): Promise<OperationVehicle>;
  update(id: number, data: OperationVehicleUpdateRequest): Promise<OperationVehicle>;
  delete(id: number): Promise<void>;
}

export class OperationVehicleRepository implements IOperationVehicleRepository {
  constructor() {}

  async findAll(): Promise<OperationVehicle[]> {
    return prisma.operationVehicle.findMany();
  }

  async findById(id: number): Promise<OperationVehicle> {
    const operationVehicle = await prisma.operationVehicle.findUnique({ where: { id } });
    if (!operationVehicle) {
      throw new EntityMissingError("Operation vehicle assignment not found");
    }
    return operationVehicle;
  }

  async create(data: OperationVehicleCreateRequest): Promise<OperationVehicle> {
    return prisma.operationVehicle.create({
      data: {
        operationId: data.operationId,
        vehicleTypeId: data.vehicleId,
        quantity: data.quantity,
      },
    });
  }

  async update(id: number, data: OperationVehicleUpdateRequest): Promise<OperationVehicle> {
    await this.findById(id);
    return prisma.operationVehicle.update({
      where: { id },
      data: {
        operationId: data.operationId,
        vehicleTypeId: data.vehicleId,
       quantity: data.quantity
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await prisma.operationVehicle.delete({
      where: { id },
    });
  }
}