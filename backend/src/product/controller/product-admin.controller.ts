import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateProductDto } from '@product/dtos/create-product.dto';
import { GetProductsQueryDto } from '@product/dtos/get-product.dto';
import { UpdateProductDto } from '@product/dtos/update-product.dto';
import { ProductService } from '@product/product.service';

@Controller('admin/product')
export class ProductControllerAdmin {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy danh sách sản phẩm thành công')
  async findAllForAdmin(@Query() query: GetProductsQueryDto) {
    return await this.productService.findAllForAdmin(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOneForAdmin(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.findOneForAdmin(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Tạo sản phẩm thành công!')
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser('sub') userId: string,
  ) {
    return await this.productService.create(dto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Cập nhật sản phẩm thành công!')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Tạm ẩn sản phẩm thành công!')
  async softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.softDelete(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Khôi phục sản phẩm thành công!')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.restore(id);
  }
}
