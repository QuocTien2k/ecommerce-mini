import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PublicService } from './public.service';
import { GetProductsQueryDto } from '@product/dtos/get-product.dto';
import { GetPublicBrandDto } from 'src/brand/dtos/get-brand.dto';
import { OptionalJwtAuthGuard } from '@auth/guards/option-jwt-auth.guard';
import { CurrentUser } from '@auth/decorators/current-user.decorator';

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('categories')
  async getCategories() {
    return this.publicService.getCategories();
  }

  @Get('brands')
  async getBrands(@Query() query: GetPublicBrandDto) {
    return this.publicService.getBrands(query);
  }

  @Get('home')
  @UseGuards(OptionalJwtAuthGuard)
  async getHomeData(@CurrentUser('sub') userId: string | undefined) {
    return this.publicService.getHomeData(userId);
  }

  @Get('products')
  @UseGuards(OptionalJwtAuthGuard)
  async getProducts(
    @CurrentUser('sub') userId: string | undefined,
    @Query() query: GetProductsQueryDto,
  ) {
    return this.publicService.getProducts(query, userId);
  }

  @Get('product/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  async getProductDetail(
    @CurrentUser('sub') userId: string | undefined,
    @Param('slug') slug: string,
  ) {
    return this.publicService.getProductDetail(slug, userId);
  }

  @Get('setting')
  async getSetting() {
    return this.publicService.getSetting();
  }
}
