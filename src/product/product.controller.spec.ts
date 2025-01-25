import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guard/roles.guard';
import { HttpStatus } from '@nestjs/common';

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
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ProductService.create and return the result', async () => {
      const dto: CreateProductDto = {
        name: 'Test Product', price: 100,
        description: '',
        stock: 0
      };
      const result = { id: 1, ...dto };

      mockProductService.create.mockResolvedValue(result);

      const response = await controller.create(dto);

      expect(response).toEqual(result);
      expect(mockProductService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call ProductService.findAll and return the result', async () => {
      const result = [{ id: 1, name: 'Product 1', price: 100 }];

      mockProductService.findAll.mockResolvedValue(result);

      const response = await controller.findAll();

      expect(response).toEqual(result);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call ProductService.findOne and return the result', async () => {
      const result = { id: 1, name: 'Product 1', price: 100 };

      mockProductService.findOne.mockResolvedValue(result);

      const response = await controller.findOne('1');

      expect(response).toEqual(result);
      expect(mockProductService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call ProductService.update and return the result', async () => {
      const dto: UpdateProductDto = {
        name: 'Updated Product', price: 150,
        description: '',
        stock: 0
      };
      const result = { id: 1, ...dto };

      mockProductService.update.mockResolvedValue(result);

      const response = await controller.update('1', dto);

      expect(response).toEqual(result);
      expect(mockProductService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call ProductService.remove and return the result', async () => {
      const result = { statusCode: HttpStatus.CREATED, message: 'Product deleted successfully' };

      mockProductService.remove.mockResolvedValue(result);

      const response = await controller.remove('1');

      expect(response).toEqual(result);
      expect(mockProductService.remove).toHaveBeenCalledWith(1);
    });
  });
});
