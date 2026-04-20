import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetProductsQueryDto } from '@product/dtos/get-product.dto';
import { ProductService } from '@product/product.service';

@Controller('product')
export class ProductControllerUser {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() query: GetProductsQueryDto) {
    return {
      message: 'Lấy danh sách sản phẩm thành công',
      data: await this.productService.findAllForUser(query),
    };
  }

  @Get(':slug')
  async findOneForUser(@Param('slug') slug: string) {
    return this.productService.findOneForUser(slug);
  }
}
