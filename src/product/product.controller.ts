import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    const userId = req.user.sub;
    const data = await this.productService.create(dto, userId);

    return {
      message: 'Tạo sản phẩm thành công',
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const data = await this.productService.update(id, dto);

    return {
      message: 'Cập nhật sản phẩm thành công',
      data,
    };
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.productService.softDelete(id);

    return {
      message: 'Tạm ẩn sản phẩm thành công',
      data,
    };
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.productService.restore(id);

    return {
      message: 'Khôi phục sản phẩm thành công',
      data,
    };
  }
}
