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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from '@category/category.service';
import { AdminCategoryQueryDto } from '@category/dtos/admin-category.dto';
import { CreateCategoryDto } from '@category/dtos/create-category.dto';
import { UpdateCategoryDto } from '@category/dtos/update-category.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller('admin/category')
export class CategoryControllerAdmin {
  constructor(private readonly categoryService: CategoryService) {}

  // Admin
  //list (pagination + filter)
  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy danh sách danh mục thành công!')
  async getAdminCategories(@Query() query: AdminCategoryQueryDto) {
    return await this.categoryService.getAdminCategories(query);
  }

  // Admin: flat (dropdown chọn parent)
  @Get('flat')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy danh mục dạng flat thành công!')
  async getFlat() {
    return await this.categoryService.getFlatCategoryTree();
  }

  //detail
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getDetail(@Param('id') categoryId: string) {
    return await this.categoryService.getDetail(categoryId);
  }

  // ACTIONS
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Tạo danh mục thành công!')
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.categoryService.create(dto, file);
  }

  //update
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Cập nhật danh mục thành công!')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.categoryService.update(id, dto, file);
  }

  //soft delete
  @Patch('soft/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Tạm khóa danh mục thành công!')
  async softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.softDeleteCategory(id);
  }

  //restore
  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Khôi phục danh mục thành công!')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.restoreCategory(id);
  }
}
