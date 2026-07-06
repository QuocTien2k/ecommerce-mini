import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { GetProductsQueryDto } from '@product/dtos/get-product.dto';
import { GetPublicBrandDto } from 'src/brand/dtos/get-brand.dto';

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('home')
  async getHomeData() {
    return this.publicService.getHomeData();
  }

  @Get('categories')
  async getCategories() {
    return this.publicService.getCategories();
  }

  @Get('brands')
  async getBrands(@Query() query: GetPublicBrandDto) {
    return this.publicService.getBrands(query);
  }

  @Get('products')
  async getProducts(@Query() query: GetProductsQueryDto) {
    return this.publicService.getProducts(query);
  }

  @Get('product/:slug')
  async getproductDetail(@Param('slug') slug: string) {
    return this.publicService.getProductDetail(slug);
  }

  @Get('setting')
  async getSetting() {
    return this.publicService.getSetting();
  }
}
