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
  async create(createProductDto: CreateProductDto) {
    try{

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
        return  {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Product not found',
          }
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    try{

      const updatedProduct = await this.ProductRepo.update( id, updateProductDto)
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

  async remove(id: number) {
    try{
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
