import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
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
import { UpdateProductVariantDto } from './dtos/update-product-variant.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  @ResponseMessage('Tạo biến thể thành công!')
  async create(
    @Body() dto: CreateProductVariantDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.productVariantService.create(dto, files);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  @ResponseMessage('Cập nhật biến thể thành công!')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductVariantDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return await this.productVariantService.update(id, dto, files);
  }
}
