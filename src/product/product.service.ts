import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    public ProductRepo: Repository<Product>
  ){}
  async create(createProductDto: CreateProductDto, user:User) {
    try{

      if(user.role!== UserRole.ADMIN){
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Only admin can delete products',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const newProduct = await this.ProductRepo.save(createProductDto)
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: newProduct,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Only admin can delete products',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  

  async findAll() {
    try{
      const products = await this.ProductRepo.find()
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Find Products successfully',
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Find Products failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    try{
      const product = await this.ProductRepo.findOne({where:{id: id}});
      if(!product){
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Find Product successfully',
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Find Product failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(updateProductDto: UpdateProductDto, user: User ) {
    try{
      if(user.role!== UserRole.ADMIN){
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Only admin can delete products',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const updatedProduct = await this.ProductRepo.update(updateProductDto.id, updateProductDto)
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product Updated successfully',
        data: updateProductDto,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Only admin can delete products',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number, user: User) {
    try{
      if(user.role!== UserRole.ADMIN){
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Only admin can delete products',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const deletedProduct = await this.ProductRepo.delete({id});
      return {
        statusCode: HttpStatus.CREATED,
        message: "Product deleted successfully",
        data: "Product deleted successfully",
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Only admin can delete products',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
