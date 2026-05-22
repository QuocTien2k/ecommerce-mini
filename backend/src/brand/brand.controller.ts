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
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { GetBrandDto } from './dtos/get-brand.dto';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy danh sách thương hiệu thành công')
  async findAllForAdmin(@Query() query: GetBrandDto) {
    return await this.brandService.findAll(query);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Tạo thương hiệu thành công!')
  async create(@Body() dto: CreateBrandDto) {
    return await this.brandService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Cập nhật thương hiệu thành công!')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    return await this.brandService.update(id, dto);
  }

  @Patch(':id/softDelete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Tạm ẩn thương hiệu thành công!')
  async softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.brandService.softDelete(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Khôi phục thương hiệu thành công!')
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.brandService.restore(id);
  }
}
