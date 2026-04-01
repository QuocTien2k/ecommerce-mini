import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '@category/category.service';

@Controller('category')
export class CategoryControllerUser {
  constructor(private readonly categoryService: CategoryService) {}

  //  PUBLIC
  @Get()
  async getPublicCategories() {
    const data = await this.categoryService.getPublicCategoryTree();

    return {
      message: 'Lấy danh mục thành công',
      data,
    };
  }
}
