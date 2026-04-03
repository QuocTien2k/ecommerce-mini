import { Injectable } from '@nestjs/common';
import {
  CartItemResponseDto,
  CartResponseDto,
} from './dtos/cart-item-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductVariantService } from '@product-variant/product-variant.service';

@Injectable()
export class CartItemsService {
  constructor(
    private prisma: PrismaService,
    private productVariantService: ProductVariantService,
  ) {}

  private mapToCartItemDto(item: any): CartItemResponseDto {
    return {
      id: item.id,

      productId: item.productId,
      variantId: item.variantId,

      productName: item.productName,

      image: item.productImage || item.variant?.images?.[0] || null,

      color: item.variant?.color,
      attributes: item.selectedAttributes || item.variant?.attributes || null,

      price: Number(item.price),
      quantity: item.quantity,

      totalPrice: Number(item.price) * item.quantity,
    };
  }

  private buildCartResponse(items: any[]): CartResponseDto {
    const mappedItems = items.map((item) => this.mapToCartItemDto(item));

    const totalQuantity = mappedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const totalPrice = mappedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    return {
      items: mappedItems,
      totalItems: mappedItems.length,
      totalQuantity,
      totalPrice,
    };
  }
}
