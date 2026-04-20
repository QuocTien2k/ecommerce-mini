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
import { CartItemsService } from './cart-items.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UpdateCartItemDto } from './dtos/update-cart.dto';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getMyCart(@CurrentUser('sub') userId: string) {
    return await this.cartItemsService.getMyCart(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async addToCart(
    @Body() dto: AddToCartDto,
    @CurrentUser('sub') userId: string,
  ) {
    return await this.cartItemsService.addToCart(userId, dto);
  }

  @Patch(':cartItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateCart(
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser('sub') userId: string,
  ) {
    return await this.cartItemsService.updateCartItem(userId, cartItemId, dto);
  }

  @Delete(':cartItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteCartItem(
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string,
    @CurrentUser('sub') userId: string,
  ) {
    const data = await this.cartItemsService.deleteCartItem(userId, cartItemId);

    return {
      message: 'Xóa sản phẩm thành công',
      data,
    };
  }
}
