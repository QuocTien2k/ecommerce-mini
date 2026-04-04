import { DecimalUtil } from '@common/utils/decimal';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type PricingItemInput = {
  price: Prisma.Decimal;
  quantity: number;
};

type CartPricingResult = {
  itemTotals: Prisma.Decimal[];
  totalQuantity: number;
  totalPrice: Prisma.Decimal;
};

@Injectable()
export class CartPricingService {
  static calculateCart(items: PricingItemInput[]): CartPricingResult {
    const itemTotals: Prisma.Decimal[] = [];

    let totalQuantity = 0;
    let totalPrice = new Prisma.Decimal(0);

    for (const item of items) {
      const itemTotal = DecimalUtil.mul(item.price, item.quantity);

      itemTotals.push(itemTotal);

      totalQuantity += item.quantity;
      totalPrice = DecimalUtil.add(totalPrice, itemTotal);
    }

    return {
      itemTotals,
      totalQuantity,
      totalPrice,
    };
  }
}
