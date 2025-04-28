import { OperationRepository } from '../src/Repositories/';
import { prisma } from '../prisma/client';
import { EntityMissingError } from '../src/common/exceptions/EntityMissingError';

// Mock Prisma Client
jest.mock('../../src/prisma/client', () => ({
  prisma: {
    operation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('OperationRepository', () => {
  let repository: OperationRepository;

  beforeEach(() => {
    repository = new OperationRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all operations', async () => {
      const operationsMock = [{ id: 1, name: 'Test Operation', operationStatus: 'active', date: new Date() }];
      (prisma.operation.findMany as jest.Mock).mockResolvedValue(operationsMock);

      const result = await repository.findAll();
      expect(result).toEqual(operationsMock);
      expect(prisma.operation.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return an operation by ID', async () => {
      const operationMock = { id: 1, name: 'Test Operation', operationStatus: 'active', date: new Date() };
      (prisma.operation.findUnique as jest.Mock).mockResolvedValue(operationMock);

      const result = await repository.findById(1);
      expect(result).toEqual(operationMock);
      expect(prisma.operation.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw EntityMissingError if operation not found', async () => {
      (prisma.operation.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(repository.findById(999)).rejects.toThrow(EntityMissingError);
      expect(prisma.operation.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('create', () => {
    it('should create a new operation', async () => {
      const request = { name: 'New Operation', operationStatus: 'active', date: new Date() };
      const createdOperation = { id: 1, ...request };
      (prisma.operation.create as jest.Mock).mockResolvedValue(createdOperation);

      const result = await repository.create(request);
      expect(result).toEqual(createdOperation);
      expect(prisma.operation.create).toHaveBeenCalledWith({
        data: {
          name: request.name,
          operationStatus: request.operationStatus,
          date: request.date,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing operation', async () => {
      const id = 1;
      const updateData = { name: 'Updated Operation', operationStatus: 'inactive', date: new Date() };
      const updatedOperation = { id, ...updateData };

      (prisma.operation.findUnique as jest.Mock).mockResolvedValue({ id, ...updateData });
      (prisma.operation.update as jest.Mock).mockResolvedValue(updatedOperation);

      const result = await repository.update(id, updateData);
      expect(result).toEqual(updatedOperation);
      expect(prisma.operation.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          name: updateData.name,
          operationStatus: updateData.operationStatus,
          date: updateData.date,
        },
      });
    });

    it('should throw EntityMissingError if trying to update non-existing operation', async () => {
      (prisma.operation.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(repository.update(999, { name: 'test', operationStatus: 'active', date: new Date() }))
        .rejects.toThrow(EntityMissingError);
    });
  });

  describe('delete', () => {
    it('should delete an existing operation', async () => {
      const id = 1;

      (prisma.operation.findUnique as jest.Mock).mockResolvedValue({ id });
      (prisma.operation.delete as jest.Mock).mockResolvedValue({});

      await repository.delete(id);
      expect(prisma.operation.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw EntityMissingError if trying to delete non-existing operation', async () => {
      (prisma.operation.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(repository.delete(999)).rejects.toThrow(EntityMissingError);
    });
  });
});