import { CategoryService } from '@category/category.service';
import { Injectable } from '@nestjs/common';
import { GetProductsQueryDto } from '@product/dtos/get-product.dto';
import { ProductService } from '@product/product.service';

@Injectable()
export class PublicService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  async getHomeData() {
    const products = await this.productService.getHomeProducts();

    return products;
  }

  /* Case category */
  async getCategories() {
    return this.categoryService.getPublicCategoryTree();
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
