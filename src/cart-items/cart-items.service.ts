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

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    private cartPricingService: CartPricingService,
  ) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    const { variantId, quantity } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
        include: {
          product: true,
        },
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

      //check cart exisiting
      const existing = await tx.cartItem.findUnique({
        where: {
          userId_variantId: {
            userId,
            variantId,
          },
        },
      });

      if (existing) {
        //validate before increment
        if (existing.quantity + quantity > variant.stock) {
          throw new BadRequestException('Số lượng vượt tồn kho');
        }

        const updated = await tx.cartItem.updateMany({
          where: {
            id: existing.id,
            quantity: {
              lte: variant.stock - quantity, //không vượt stock
            },
          },
          data: {
            quantity: {
              increment: quantity,
            },
          },
        });
      } else {
        // case empty cart
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

      // nếu quantity = 0 → xoá
      if (quantity === 0) {
        await tx.cartItem.delete({
          where: { id: cartItemId },
        });
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

        // tránh race condition
        const updated = await tx.cartItem.updateMany({
          where: {
            id: cartItemId,
            userId,
          },
          data: {
            quantity,
          },
        });

        if (updated.count === 0) {
          throw new BadRequestException('Cập nhật thất bại, thử lại');
        }
      }

      // lấy lại cart
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
    });
  }
}
