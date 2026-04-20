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

export type NormalizedItem = {
  variantId: string;
  quantity: number;
};

export type Receiver = {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
};

export type CreateOrderContext = {
  userId: string;
  receiver: Receiver;
  orderItemsData: OrderItemData[];
  subtotal: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  voucherCode: string | null;
  voucherType: VoucherType | null;
  voucherValue: Prisma.Decimal | null;
  note?: string;
};
