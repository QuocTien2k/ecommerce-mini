import { Prisma, VoucherType } from '@prisma/client';

export type OrderItemData = {
  productId: string;
  variantId: string;
  quantity: number;
  price: Prisma.Decimal;
  productName: string;
  productImage: string | null;
  selectedAttributes?: any;
};

export type ApplyVoucherResult = {
  subtotal: number;
  discount: number;
  finalTotal: number;
  appliedSubtotal: number;
  voucherId: string;
  voucherCode?: string;
  type?: VoucherType;
  value?: number;
  usageLimit?: number | null;
  remainingUsage?: number | null;
};

export type NormalizedItem = {
  variantId: string;
  quantity: number;
};

export type CreateOrderContext = {
  userId: string;
  receiver: {
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
  };
  orderItemsData: OrderItemData[];
  subtotal: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  voucherCode: string | null;
  voucherType: VoucherType | null;
  voucherValue: Prisma.Decimal | null;
  note?: string;
};
