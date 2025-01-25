import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product and return the result', async () => {
      const dto: CreateProductDto = {
        name: 'Test Product', price: 100,
        description: '',
        stock: 0
      };
      const result = { id: 1, ...dto };

      mockRepository.save.mockResolvedValue(result);

      const response = await service.create(dto);

      expect(response).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: result,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });

    it('should throw an error when creation fails', async () => {
      const dto: CreateProductDto = {
        name: 'Test Product', price: 100,
        description: '',
        stock: 0
      };
      mockRepository.save.mockRejectedValue(new Error('Save error'));

      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = [{ id: 1, name: 'Product 1', price: 100 }];

      mockRepository.find.mockResolvedValue(result);

      const response = await service.findAll();

      expect(response).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Find Products successfully',
        data: result,
      });
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should throw an error when finding products fails', async () => {
      mockRepository.find.mockRejectedValue(new Error('Find error'));

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const result = { id: 1, name: 'Product 1', price: 100 };

      mockRepository.findOne.mockResolvedValue(result);

      const response = await service.findOne(1);

      expect(response).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Find Product successfully',
        data: result,
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return an error message if the product is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const response = await service.findOne(1);

      expect(response).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Product not found',
      });
    });

    it('should throw an error when finding a product fails', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Find error'));

      await expect(service.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a product and return the result', async () => {
      const dto: UpdateProductDto = {
        name: 'Updated Product', price: 150,
        description: '',
        stock: 0
      };
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const response = await service.update(1, dto);

      expect(response).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Product Updated successfully',
        data: dto,
      });
      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw an error when update fails', async () => {
      const dto: UpdateProductDto = {
        name: 'Updated Product', price: 150,
        description: '',
        stock: 0
      };
      mockRepository.update.mockRejectedValue(new Error('Update error'));

      await expect(service.update(1, dto)).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a product and return a success message', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const response = await service.remove(1);

      expect(response).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Product deleted successfully',
        data: 'Product deleted successfully',
      });
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error when deletion fails', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Delete error'));

      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
  });
});
