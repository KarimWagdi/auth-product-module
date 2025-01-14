import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Or 'postgres', 'sqlite', etc.
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Password@12345',
      database: 'task',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
