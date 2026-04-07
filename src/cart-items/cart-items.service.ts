import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductVariantService } from '@product-variant/product-variant.service';
import { CartPricingService } from 'src/cart-pricing/cart-pricing.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { buildCartResponse } from './mappers/cart.mapper';
import { UpdateCartItemDto } from './dtos/update-cart.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    private cartPricingService: CartPricingService,
  ) {}

  async getMyCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { variant: true },
      orderBy: { createdAt: 'desc' },
    });

    const pricingInput = items.map((i) => ({
      price: i.price,
      quantity: i.quantity,
    }));

    const { itemTotals, totalPrice, totalQuantity } =
      this.cartPricingService.calculateCart(pricingInput);

    return buildCartResponse(
      items.map((i) => ({
        ...i,
        productImage: i.productImage ?? undefined,
      })),
      itemTotals,
      totalQuantity,
      totalPrice,
    );
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const { variantId, quantity } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new NotFoundException('Chi tiết sản phẩm không tìm thấy!');
      }

      if (quantity <= 0) {
        throw new BadRequestException('Số lượng mua phải lớn hơn 0!');
      }

      if (variant.stock <= 0) {
        throw new BadRequestException('Sản phẩm đã hết!');
      }

      // Kiểm tra item
      const existing = await tx.cartItem.findUnique({
        where: { userId_variantId: { userId, variantId } },
      });

      if (existing) {
        // Cập nhật số lượng
        if (existing.quantity + quantity > variant.stock) {
          throw new BadRequestException('Số lượng vượt tồn kho');
        }

        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: quantity } },
        });
      } else {
        // Thêm mới
        if (quantity > variant.stock) {
          throw new BadRequestException('Số lượng vượt tồn kho');
        }

        await tx.cartItem.create({
          data: {
            userId,
            productId: variant.productId,
            variantId,
            quantity,
            price: variant.product.price,
            productName: variant.product.name,
            productImage: variant.images?.[0] ?? undefined,
            selectedAttributes: variant.attributes ?? undefined,
          },
        });
      }

      // refresh cart và trả về response
      return this.refreshCartAndBuildResponse(tx, userId);
    });
  }

  async updateCartItem(
    userId: string,
    cartItemId: string,
    dto: UpdateCartItemDto,
  ) {
    const { quantity } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.cartItem.findUnique({
        where: { id: cartItemId },
      });

      if (!existing || existing.userId !== userId) {
        throw new NotFoundException('Giỏ hàng không tồn tại');
      }

      if (quantity === 0) {
        await tx.cartItem.delete({ where: { id: cartItemId } });
      } else {
        const variant = await tx.productVariant.findUnique({
          where: { id: existing.variantId },
        });

        if (!variant) {
          throw new NotFoundException('Chi tiết sản phẩm không tồn tại');
        }

        if (variant.stock < quantity) {
          throw new BadRequestException('Số lượng vượt tồn kho');
        }

        const updated = await tx.cartItem.updateMany({
          where: { id: cartItemId, userId },
          data: { quantity },
        });

        if (updated.count === 0) {
          throw new BadRequestException('Cập nhật thất bại, thử lại');
        }
      }

      return this.refreshCartAndBuildResponse(tx, userId);
    });
  }

  async deleteCartItem(userId: string, cartItemId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.cartItem.findUnique({
        where: { id: cartItemId },
      });

      if (!existing || existing.userId !== userId) {
        throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      await tx.cartItem.delete({ where: { id: cartItemId } });

      return this.refreshCartAndBuildResponse(tx, userId);
    });
  }

  private async refreshCartAndBuildResponse(
    tx: Prisma.TransactionClient,
    userId: string,
  ) {
    const items = await tx.cartItem.findMany({
      where: { userId },
      include: { variant: true },
      orderBy: { createdAt: 'desc' },
    });

    const pricingInput = items.map((i) => ({
      price: i.price,
      quantity: i.quantity,
    }));

    const { itemTotals, totalPrice, totalQuantity } =
      this.cartPricingService.calculateCart(pricingInput);

    return buildCartResponse(
      items.map((i) => ({
        ...i,
        productImage: i.productImage ?? undefined,
      })),
      itemTotals,
      totalQuantity,
      totalPrice,
    );
  }
}
