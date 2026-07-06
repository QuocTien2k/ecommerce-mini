import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { BrandModule } from 'src/brand/brand.module';
import { CategoryModule } from '@category/category.module';
import { ProductModule } from '@product/product.module';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [ProductModule, CategoryModule, BrandModule, SettingModule],
  providers: [PublicService],
  controllers: [PublicController],
})
export class PublicModule {}
