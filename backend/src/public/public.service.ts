import { CategoryService } from '@category/category.service';
import { Injectable } from '@nestjs/common';
import { GetProductsQueryDto } from '@product/dtos/get-product.dto';
import { ProductService } from '@product/product.service';
import { BrandService } from 'src/brand/brand.service';
import { GetPublicBrandDto } from 'src/brand/dtos/get-brand.dto';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
export class PublicService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly settingService: SettingService,
  ) {}

  /* Case category */
  async getCategories() {
    return this.categoryService.getPublicCategoryTree();
  }

  /* Casr brand */
  async getBrands(query: GetPublicBrandDto) {
    return this.brandService.findAllPublic(query);
  }

  /* Case product */
  async getHomeData(userId?: string) {
    return this.productService.getHomeProducts(userId);
  }

  async getProducts(query: GetProductsQueryDto, userId?: string) {
    return this.productService.findAllProducts(query, userId);
  }

  async getProductDetail(slug: string, userId?: string) {
    return this.productService.findProductDetail(slug, userId);
  }

  async getRelatedProducts(slug: string, userId?: string) {
    return this.productService.findRelatedProducts(slug, userId);
  }

  /* Case setting */
  async getSetting() {
    return this.settingService.findOne();
  }
}
