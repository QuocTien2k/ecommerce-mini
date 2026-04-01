import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from '@common/cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, PrismaModule, CloudinaryModule],
  providers: [ProductVariantService],
  controllers: [ProductVariantController],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
