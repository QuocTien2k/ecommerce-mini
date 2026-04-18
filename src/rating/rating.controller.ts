import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RatingService } from '@rating/rating.service';
import { CreateRatingDto } from '@rating/dtos/create-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

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
}
