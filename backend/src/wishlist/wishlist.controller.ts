import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { Role } from '@prisma/client';
import { WishlistService } from './wishlist.service';
import { GetWishlistQueryDto } from './dtos/get-wishlist.dto';

@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ResponseMessage('Lấy danh sách yêu thích thành công')
  getWishlist(
    @CurrentUser('sub') userId: string,
    @Query() query: GetWishlistQueryDto,
  ) {
    return this.wishlistService.getWishlist(userId, query);
  }

  @Patch(':productId')
  @ResponseMessage('Cập nhật danh sách yêu thích thành công')
  toggleWishlist(
    @CurrentUser('sub') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.wishlistService.toggleWishlist(userId, productId);
  }
}
