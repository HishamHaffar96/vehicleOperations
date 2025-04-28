import { VehicleType } from "@prisma/client";
import { VehicleTypeCreateRequest, VehicleTypeUpdateRequest } from "../Requests";
import { prisma } from '../../prisma/client'; 
import { EntityMissingError } from "../common/exceptions/EntityMissingError";
export interface IVehicleTypeRepository {
  findAll(): Promise<VehicleType[]>;
  findById(id: number): Promise<VehicleType>;
  create(data: VehicleTypeCreateRequest): Promise<VehicleType>;
  update(id: number, data: VehicleTypeUpdateRequest): Promise<VehicleType>;
  delete(id: number): Promise<void>;
}



export class VehicleTypeRepository implements IVehicleTypeRepository {
    constructor() {}
  
    async findAll(): Promise<VehicleType[]> {
      return prisma.vehicleType.findMany();
    }
  
    async findById(id: number): Promise<VehicleType> {
      const vehicleType = await prisma.vehicleType.findUnique({ where: { id } });
      if (!vehicleType) {
        throw new EntityMissingError("Vehicle type not found");
      }
      return vehicleType;
    }
  
    async create(data: VehicleTypeCreateRequest): Promise<VehicleType> {
      return prisma.vehicleType.create({
        data: {
          name: data.name,
        },
      });
    }
  
    async update(id: number, data: VehicleTypeUpdateRequest): Promise<VehicleType> {
      await this.findById(id);
      return prisma.vehicleType.update({
        where: { id },
        data: {
          name: data.name,
        },
      });
    }
  
    async delete(id: number): Promise<void> {
      await this.findById(id); 
      await prisma.vehicleType.delete({
        where: { id },
      });
    }
  }