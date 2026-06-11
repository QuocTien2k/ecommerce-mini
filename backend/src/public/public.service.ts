import { CategoryService } from '@category/category.service';
import { Injectable } from '@nestjs/common';
import { GetProductsQueryDto } from '@product/dtos/get-product.dto';
import { ProductService } from '@product/product.service';
import { BrandService } from 'src/brand/brand.service';
import { GetPublicBrandDto } from 'src/brand/dtos/get-brand.dto';

@Injectable()
export class PublicService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}

  async getHomeData() {
    const products = await this.productService.getHomeProducts();

    return products;
  }

  /* Case category */
  async getCategories() {
    return this.categoryService.getPublicCategoryTree();
  }

  /* Casr brand */
  async getBrands(query: GetPublicBrandDto) {
    return this.brandService.findAllPublic(query);
  }

  /* Case product */
  async getProducts(query: GetProductsQueryDto) {
    const products = await this.productService.findAllProducts(query);

    return products;
  }

  async getProductDetail(slug: string) {
    const product_detail = await this.productService.findProductDetail(slug);

    return product_detail;
  }
}
