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
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':productId/me')
  @UseGuards(JwtAuthGuard)
  async getMyRating(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return await this.ratingService.getMyRating(userId, productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Đánh giá sản phẩm thành công!')
  async createRating(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return await this.ratingService.create(userId, dto);
  }

  @Patch(':productId')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Cập nhật đánh giá thành công!')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return await this.ratingService.update(userId, productId, dto);
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Xóa đánh giá thành công!')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return await this.ratingService.delete(userId, productId);
  }
}
