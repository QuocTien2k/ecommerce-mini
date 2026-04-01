import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductVariantModule } from 'src/product-variant/product-variant.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [AuthModule, PrismaModule, ProductVariantModule, CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
