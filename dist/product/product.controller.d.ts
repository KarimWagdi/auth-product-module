import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    create(req: any, createProductDto: CreateProductDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: CreateProductDto & import("./entities/product.entity").Product;
    }>;
    findAll(): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: import("./entities/product.entity").Product[];
    }>;
    findOne(id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: import("./entities/product.entity").Product;
    }>;
    update(req: any, updateProductDto: UpdateProductDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: UpdateProductDto;
    }>;
    remove(req: any, id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
        data: string;
    }>;
}
