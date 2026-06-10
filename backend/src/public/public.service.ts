import { Injectable } from '@nestjs/common';
import { ProductService } from '@product/product.service';

@Injectable()
export class PublicService {
  constructor(private readonly productService: ProductService) {}

  async getHomeData() {
    const products = await this.productService.getHomeProducts();

    return {
      products,
    };
  }
}
