import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AdminCategoryQueryDto } from './dtos/admin-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //  PUBLIC
  // User: lấy menu (level 2)
  @Get()
  async getPublicCategories() {
    const data = await this.categoryService.getPublicCategoryTree();

    return {
      message: 'Lấy danh mục thành công',
      data,
    };
  }

  // Admin
  //list (pagination + filter)
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAdminCategories(@Query() query: AdminCategoryQueryDto) {
    const data = await this.categoryService.getAdminCategories(query);

    return {
      message: 'Lấy danh sách danh mục thành công',
      ...data,
    };
  }

  // Admin: flat (dropdown chọn parent)
  @Get('admin/flat')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getFlat() {
    const data = await this.categoryService.getFlatCategoryTree();

    return {
      message: 'Lấy danh mục dạng flat thành công',
      data,
    };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.categoryService.create(dto, file);

    return {
      message: 'Tạo danh mục thành công',
      data,
    };
  }

  // Admin: update
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.categoryService.update(id, dto, file);

    return {
      message: 'Cập nhật danh mục thành công',
      data,
    };
  }
}
