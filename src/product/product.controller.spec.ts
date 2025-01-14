import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from '../user/entities/user.entity';
import { UpdateProductDto } from './dto/update-product.dto';

// Mock ProductService
const mockProductService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mocking JwtAuthGuard to avoid real auth flow
      .useValue({
        canActivate: jest.fn().mockResolvedValue(true), // Mock guard to always pass
      })
      .compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should create a product successfully when user is admin', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: '',
        stock: 0
      };
      const mockUser = { role: 'admin' } as User;

      mockProductService.create.mockResolvedValue({
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: createProductDto,
      });

      const result = await productController.create({ user: mockUser }, createProductDto);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Product created successfully');
      expect(mockProductService.create).toHaveBeenCalledWith(createProductDto, mockUser);
    });

    it('should throw an error when user is not admin', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: '',
        stock: 0
      };
      const mockUser = { role: 'user' } as User;

      mockProductService.create.mockResolvedValue({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Only admin can delete products',
      });

      try {
        await productController.create({ user: mockUser }, createProductDto);
      } catch (e) {
        expect(e.response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(e.response.message).toBe('Only admin can delete products');
      }
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ];

      mockProductService.findAll.mockResolvedValue({
        statusCode: HttpStatus.CREATED,
        message: 'Find Products successfully',
        data: mockProducts,
      });

      const result = await productController.findAll();

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Find Products successfully');
      expect(result.data).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 100 };

      mockProductService.findOne.mockResolvedValue({
        statusCode: HttpStatus.CREATED,
        message: 'Find Product successfully',
        data: mockProduct,
      });

      const result = await productController.findOne('1');

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Find Product successfully');
      expect(result.data).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product successfully when user is admin', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product', price: 150,
        id: 0,
        description: '',
        stock: 0
      };
      const mockUser = { role: 'admin' } as User;

      mockProductService.update.mockResolvedValue({
        statusCode: HttpStatus.CREATED,
        message: 'Product Updated successfully',
        data: updateProductDto,
      });

      const result = await productController.update(
        { user: mockUser },
        updateProductDto,
      );

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Product Updated successfully');
      expect(mockProductService.update).toHaveBeenCalledWith(updateProductDto, mockUser);
    });

    it('should throw an error when user is not admin', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product', price: 150,
        id: 0,
        description: '',
        stock: 0
      };
      const mockUser = { role: 'user' } as User;

      try {
        await productController.update({ user: mockUser }, updateProductDto);
      } catch (e) {
        expect(e.response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(e.response.message).toBe('Only admin can delete products');
      }
    });
  });

  describe('remove', () => {
    it('should remove a product successfully when user is admin', async () => {
      const mockUser = { role: 'admin' } as User;

      mockProductService.remove.mockResolvedValue({
        statusCode: HttpStatus.CREATED,
        message: 'Product deleted successfully',
        data: 'Product deleted successfully',
      });

      const result = await productController.remove({ user: mockUser }, '1');

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Product deleted successfully');
      expect(mockProductService.remove).toHaveBeenCalledWith(1, mockUser);
    });

    it('should throw an error when user is not admin', async () => {
      const mockUser = { role: 'user' } as User;

      try {
        await productController.remove({ user: mockUser }, '1');
      } catch (e) {
        expect(e.response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(e.response.message).toBe('Only admin can delete products');
      }
    });
  });
});
