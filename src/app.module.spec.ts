import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should include UserModule', () => {
    const userModule = app.select(UserModule);
    expect(userModule).toBeDefined();
  });

  it('should include ProductModule', () => {
    const productModule = app.select(ProductModule);
    expect(productModule).toBeDefined();
  });

});
