import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { ProductVariantService } from './product-variant.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() dto: CreateProductVariantDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const data = await this.productVariantService.create(dto, files);

    return {
      message: 'Tạo biến thể sản phẩm thành công',
      data,
    };
  }
}
