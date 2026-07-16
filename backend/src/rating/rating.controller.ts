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
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { RatingService } from '@rating/rating.service';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { RatingDto } from './dtos/rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':productId/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getMyRating(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return await this.ratingService.getMyRating(userId, productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Đánh giá sản phẩm thành công!')
  async upsertRating(
    @CurrentUser('sub') userId: string,
    @Body() dto: RatingDto,
  ) {
    return await this.ratingService.upsert(userId, dto);
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Xóa đánh giá thành công!')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return await this.ratingService.delete(userId, productId);
  }
}
