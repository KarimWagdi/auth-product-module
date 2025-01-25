import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guard/roles.guard';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService,{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class ProductModule {}
