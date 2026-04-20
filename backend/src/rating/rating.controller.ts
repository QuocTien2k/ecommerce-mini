import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { RatingService } from '@rating/rating.service';
import { CreateRatingDto } from '@rating/dtos/create-rating.dto';
import { UpdateRatingDto } from '@rating/dtos/update-rating.sto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':productId/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getMyRating(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    const data = await this.ratingService.getMyRating(userId, productId);

    return {
      message: 'Lấy đánh giá của bạn thành công!',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createRating(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateRatingDto,
  ) {
    const data = await this.ratingService.create(userId, dto);
    return {
      message: 'Đánh giá sản phẩm thành công!',
      data,
    };
  }

  @Patch(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    const data = await this.ratingService.update(userId, productId, dto);

    return {
      message: 'Cập nhật đánh giá thành công!',
      data,
    };
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    const data = await this.ratingService.delete(userId, productId);

    return {
      message: 'Xóa đánh giá thành công!',
      data,
    };
  }
}
