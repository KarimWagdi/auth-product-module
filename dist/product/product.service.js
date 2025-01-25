"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
let ProductService = class ProductService {
    constructor(ProductRepo) {
        this.ProductRepo = ProductRepo;
    }
    async create(createProductDto, user) {
        try {
            if (user.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'Only admin can delete products',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            const newProduct = await this.ProductRepo.save(createProductDto);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Product created successfully',
                data: newProduct,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Only admin can delete products',
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const products = await this.ProductRepo.find();
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Find Products successfully',
                data: products,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Find Products failed',
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const product = await this.ProductRepo.findOne({ where: { id: id } });
            if (!product) {
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Product not found',
                };
            }
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Find Product successfully',
                data: product,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Find Product failed',
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateProductDto, user) {
        try {
            if (user.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'Only admin can delete products',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            const updatedProduct = await this.ProductRepo.update(id, updateProductDto);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Product Updated successfully',
                data: updateProductDto,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Only admin can delete products',
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id, user) {
        try {
            if (user.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.FORBIDDEN,
                    message: 'Only admin can delete products',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            const deletedProduct = await this.ProductRepo.delete({ id });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: "Product deleted successfully",
                data: "Product deleted successfully",
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Only admin can delete products',
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map