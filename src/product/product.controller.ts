import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsQueryDto } from './dtos/get-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ADMIN ROUTES
  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAllForAdmin(@Query() query: GetProductsQueryDto) {
    return {
      message: 'Lấy danh sách sản phẩm thành công',
      data: await this.productService.findAllForAdmin(query),
    };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOneForAdmin(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.findOneForAdmin(id);
  }

  // PUBLIC ROUTES
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

  // ACTIONS
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    const userId = req.user.sub;
    return {
      message: 'Tạo sản phẩm thành công',
      data: await this.productService.create(dto, userId),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return {
      message: 'Cập nhật sản phẩm thành công',
      data: await this.productService.update(id, dto),
    };
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return {
      message: 'Tạm ẩn sản phẩm thành công',
      data: await this.productService.softDelete(id),
    };
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return {
      message: 'Khôi phục sản phẩm thành công',
      data: await this.productService.restore(id),
    };
  }
}
