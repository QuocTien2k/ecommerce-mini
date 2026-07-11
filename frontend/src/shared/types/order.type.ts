import type { VoucherType } from "@features/admin/vouchers/types/admin-voucher.type";
import type {
  PaymentMethod,
  PaymentStatus,
} from "@features/customer/payment/types/payment.type";
import type { OrderStatus } from "@shared/types/order-status.type";

export interface GetOrdersQuery {
  orderId?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  thumbnail: string | null;
  totalPrice: string;
  itemCount: number;

  createdAt: string;
}

/* Case detail */
export interface OrderPricing {
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
}

export interface OrderReceiver {
  name: string;
  phone: string;
  address: string;
}

export interface OrderVoucher {
  code: string;
  type: VoucherType;
  value: number;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface OrderItemDetail {
  id: string;

  productId: string;
  variantId: string;

  quantity: number;
  price: number;

  productName: string;
  slug: string;
  productImage?: string;

  selectedAttributes?: Record<string, string>;
}

export interface OrderDetail {
  id: string;

  status: OrderStatus;
  statusLabel: string;

  payment: OrderPayment;

  pricing: OrderPricing;

  voucher: OrderVoucher | null;

  receiver: OrderReceiver;

  note?: string | null;

  items: OrderItemDetail[];

  createdAt: string;
  updatedAt: string;
}
