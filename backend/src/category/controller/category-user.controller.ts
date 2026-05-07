import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '@category/category.service';

@Controller('category')
export class CategoryControllerUser {
  constructor(private readonly categoryService: CategoryService) {}

  //  PUBLIC
  @Get()
  async getPublicCategories() {
    return await this.categoryService.getPublicCategoryTree();
  }
}
