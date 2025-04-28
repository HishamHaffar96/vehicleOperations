import { Operation } from "@prisma/client";
import { OperationCreateRequest, OperationUpdateRequest } from "../Requests";
import { prisma } from '../../prisma/client';
import { EntityMissingError } from "../common/exceptions/EntityMissingError";

export interface IOperationRepository {
  findAll(): Promise<Operation[]>;
  findById(id: number): Promise<Operation>;
  create(data: OperationCreateRequest): Promise<Operation>;
  update(id: number, data: OperationUpdateRequest): Promise<Operation>;
  delete(id: number): Promise<void>;
}

export class OperationRepository implements IOperationRepository {
  constructor() {}

  async findAll(): Promise<Operation[]> {
    return prisma.operation.findMany();
  }

  async findById(id: number): Promise<Operation> {
    const operation = await prisma.operation.findUnique({ where: { id } });
    if (!operation) {
      throw new EntityMissingError("Operation not found");
    }
    return operation;
  }

  async create(data: OperationCreateRequest): Promise<Operation> {
    return prisma.operation.create({
      data: {
        name: data.name,
        operationStatus: data.operationStatus || 'active',
        date: data.date,
      },
    });
  }

  async update(id: number, data: OperationUpdateRequest): Promise<Operation> {
    await this.findById(id);
    return prisma.operation.update({
      where: { id },
      data: {
        name: data.name,
        operationStatus: data.operationStatus,
        date: data.date,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await prisma.operation.delete({
      where: { id },
    });
  }
}