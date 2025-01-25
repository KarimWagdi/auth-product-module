import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../user/entities/user.entity';


@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create( @Request() req, @Body() createProductDto: CreateProductDto) {
    const user = req['user'] as User;
    return await this.productService.create(createProductDto, user);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  update( @Request() req, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const user = req['user'] as User;
    return this.productService.update( +id, updateProductDto, user );
  }

  @Delete(':id')
  remove( @Request() req, @Param('id') id: string) {
    const user = req['user'] as User;
    return this.productService.remove(+id, user);
  }
}
