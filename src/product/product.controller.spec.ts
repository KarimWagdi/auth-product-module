import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User, UserRole } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1', price: 100,
        description: '',
        stock: 0
      };
      const user: User = {
        id: 0,
        email: '',
        password: '',
        role: UserRole.ADMIN,
        token: '',
        createdAt: undefined,
        updatedAt: undefined
      } ;
      const request = { user };

      mockProductService.create.mockResolvedValue({ id: 1, ...createProductDto });

      expect(await controller.create(request, createProductDto)).toEqual({
        id: 1,
        ...createProductDto,
      });
      expect(mockProductService.create).toHaveBeenCalledWith(createProductDto, user);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = [{ id: 1, name: 'Product 1', price: 100 }];
      mockProductService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = { id: 1, name: 'Product 1', price: 100 };
      mockProductService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockProductService.findOne).toHaveBeenCalledWith(1);
    });

    
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product', price: 200,
        description: '',
        stock: 0
      };
      const user: User = {
        id: 0,
        email: '',
        password: '',
        role: UserRole.ADMIN,
        token: '',
        createdAt: undefined,
        updatedAt: undefined
      } ;
      const request = { user };

      mockProductService.update.mockResolvedValue({ id: 1, ...updateProductDto });

      expect(await controller.update(request, '1', updateProductDto)).toEqual({
        id: 1,
        ...updateProductDto,
      });
      expect(mockProductService.update).toHaveBeenCalledWith(1, updateProductDto, user);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const user: User = {
        id: 0,
        email: '',
        password: '',
        role: UserRole.ADMIN,
        token: '',
        createdAt: undefined,
        updatedAt: undefined
      };
      const request = { user };

      mockProductService.remove.mockResolvedValue({ id: 1 });

      expect(await controller.remove(request, '1')).toEqual({ id: 1 });
      expect(mockProductService.remove).toHaveBeenCalledWith(1, user);
    });
  });
});
