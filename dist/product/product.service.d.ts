import { HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from '../user/entities/user.entity';
export declare class ProductService {
    ProductRepo: Repository<Product>;
    constructor(ProductRepo: Repository<Product>);
    create(createProductDto: CreateProductDto, user: User): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: CreateProductDto & Product;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Product[];
    }>;
    findOne(id: number): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Product;
    }>;
    update(updateProductDto: UpdateProductDto, user: User): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: UpdateProductDto;
    }>;
    remove(id: number, user: User): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: string;
    }>;
}
