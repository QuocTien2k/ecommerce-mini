import {
  CartItemResponseDto,
  CartResponseDto,
} from '@cart-items/dtos/cart-item-response.dto';
import { DecimalUtil } from '@common/utils/decimal';
import { Prisma } from '@prisma/client';

type CartItemEntity = {
  id: string;
  productId: string;
  variantId: string;

  productName: string;
  productImage?: string;

  price: Prisma.Decimal;
  quantity: number;

  selectedAttributes?: any;

  variant?: {
    images?: string[];
    color?: string;
    attributes?: any;
  };
};

export const mapToCartItemDto = (
  item: CartItemEntity,
  itemTotal: Prisma.Decimal,
): CartItemResponseDto => {
  return {
    id: item.id,

    productId: item.productId,
    variantId: item.variantId,

    productName: item.productName,

    image: item.productImage || item.variant?.images?.[0] || undefined,

    color: item.variant?.color,
    attributes:
      item.selectedAttributes || item.variant?.attributes || undefined,

    price: DecimalUtil.toNumber(item.price),
    quantity: item.quantity,

    totalPrice: DecimalUtil.toNumber(itemTotal),
  };
};

export const buildCartResponse = (
  items: CartItemEntity[],
  itemTotals: Prisma.Decimal[],
  totalQuantity: number,
  totalPrice: Prisma.Decimal,
): CartResponseDto => {
  const mappedItems = items.map((item, index) =>
    mapToCartItemDto(item, itemTotals[index]),
  );

  return {
    items: mappedItems,
    totalItems: mappedItems.length,
    totalQuantity,
    totalPrice: DecimalUtil.toNumber(totalPrice),
  };
};
