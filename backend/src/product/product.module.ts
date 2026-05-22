import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductVariantModule } from 'src/product-variant/product-variant.module';
import { CategoryModule } from 'src/category/category.module';
import { ProductControllerAdmin } from './controller/product-admin.controller';
import { ProductControllerUser } from './controller/product-user.controller';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProductVariantModule,
    CategoryModule,
    BrandModule,
  ],
  controllers: [ProductControllerAdmin, ProductControllerUser],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
