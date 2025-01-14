import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

const mockProductRepo = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProductService', () => {
  let productService: ProductService;
  let productRepo: Repository<Product>;

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

    productService = module.get<ProductService>(ProductService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('create', () => {
    it('should create a product successfully for admin user', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product', price: 100,
        description: '',
        stock: 0
      };
      const adminUser = { role: UserRole.ADMIN } as User;
      const savedProduct = { id: 1, ...createProductDto };

      mockProductRepo.save.mockResolvedValue(savedProduct);

      const result = await productService.create(createProductDto, adminUser);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Product created successfully');
      expect(result.data).toEqual(savedProduct);
      expect(mockProductRepo.save).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw forbidden error for non-admin user', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product', price: 100,
        description: '',
        stock: 0
      };
      const nonAdminUser = { role: UserRole.USER } as User;

      await expect(
        productService.create(createProductDto, nonAdminUser),
      ).rejects.toThrow(HttpException);

      await expect(
        productService.create(createProductDto, nonAdminUser),
      ).rejects.toThrow('Only admin can delete products');
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ];

      mockProductRepo.find.mockResolvedValue(mockProducts);

      const result = await productService.findAll();

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Find Products successfully');
      expect(result.data).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 100 };

      mockProductRepo.findOne.mockResolvedValue(mockProduct);

      const result = await productService.findOne(1);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Find Product successfully');
      expect(result.data).toEqual(mockProduct);
    });

    it('should throw an error if product is not found', async () => {
      mockProductRepo.findOne.mockResolvedValue(null);

      await expect(productService.findOne(1)).rejects.toThrow(HttpException);

      await expect(productService.findOne(1)).rejects.toThrow('Find Product failed');
    });
  });

  describe('update', () => {
    it('should update a product successfully for admin user', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product', price: 150,
        id: 0,
        description: '',
        stock: 0
      };
      const adminUser = { role: UserRole.ADMIN } as User;

      mockProductRepo.update.mockResolvedValue({ affected: 1 });

      const result = await productService.update(1, updateProductDto, adminUser);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Product Updated successfully');
      expect(result.data).toEqual(updateProductDto);
    });

    it('should throw forbidden error for non-admin user', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product', price: 150,
        id: 0,
        description: '',
        stock: 0
      };
      const nonAdminUser = { role: UserRole.USER } as User;

      await expect(
        productService.update(1, updateProductDto, nonAdminUser),
      ).rejects.toThrow(HttpException);

      await expect(
        productService.update(1, updateProductDto, nonAdminUser),
      ).rejects.toThrow('Only admin can delete products');
    });
  });

  describe('remove', () => {
    it('should remove a product successfully for admin user', async () => {
      const adminUser = { role: UserRole.ADMIN } as User;

      mockProductRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await productService.remove(1, adminUser);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Product deleted successfully');
    });

    it('should throw forbidden error for non-admin user', async () => {
      const nonAdminUser = { role: UserRole.USER } as User;

      await expect(productService.remove(1, nonAdminUser)).rejects.toThrow(HttpException);

      await expect(productService.remove(1, nonAdminUser)).rejects.toThrow(
        'Only admin can delete products',
      );
    });
  });
});
