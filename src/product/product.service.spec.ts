import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Repository<Product>;

  const mockProductRepo = {
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
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product if user is admin', async () => {
      const createProductDto: CreateProductDto = {
        name: '',
        description: '',
        price: 0,
        stock: 0
      };
      const user: User = { id: 1, role: UserRole.ADMIN } as User;

      mockProductRepo.save.mockResolvedValue({ id: 1, ...createProductDto });

      const result = await service.create(createProductDto, user);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: { id: 1, ...createProductDto },
      });
      expect(mockProductRepo.save).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw an exception if user is not admin', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1', price: 100,
        description: '',
        stock: 0
      };
      const user: User = { id: 1, role: UserRole.USER } as User;

      await expect(service.create(createProductDto, user)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Product 1', price: 100 }];
      mockProductRepo.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Find Products successfully',
        data: products,
      });
      expect(mockProductRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Product 1', price: 100 };
      mockProductRepo.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Find Product successfully',
        data: product,
      });
      expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return a not found response if product is not found', async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Product not found',
      });
    });
  });

  describe('update', () => {
    it('should update a product if user is admin', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product', price: 200,
        description: '',
        stock: 0
      };
      const user: User = { id: 1, role: UserRole.ADMIN } as User;

      mockProductRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateProductDto, user);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Product Updated successfully',
        data: updateProductDto,
      });
      expect(mockProductRepo.update).toHaveBeenCalledWith(1, updateProductDto);
    });

    it('should throw an exception if user is not admin', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product', price: 200,
        description: '',
        stock: 0
      };
      const user: User = { id: 1, role: UserRole.USER } as User;

      await expect(service.update(1, updateProductDto, user)).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a product if user is admin', async () => {
      const user: User = { id: 1, role: UserRole.ADMIN } as User;

      mockProductRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1, user);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Product deleted successfully',
        data: 'Product deleted successfully',
      });
      expect(mockProductRepo.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an exception if user is not admin', async () => {
      const user: User = { id: 1, role: UserRole.USER } as User;

      await expect(service.remove(1, user)).rejects.toThrow(HttpException);
    });
  });
});
