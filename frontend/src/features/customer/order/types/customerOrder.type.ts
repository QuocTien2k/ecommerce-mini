import type { CartItem } from "@features/customer/cart/types/customer-cart.type";
import {
  PAYMENT_METHODS,
  type OrderPaymentResponse,
  type PaymentMethod,
} from "./payment.type";
import { mapCartItemsToOrderItems } from "../mapper/buildOrderItem";
import type { OrderStatus } from "./order-status.type";
import type { VoucherType } from "@features/admin/vouchers/types/admin-voucher.type";

export interface CreateOrderItemRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  voucherCode?: string | null;

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;

  paymentMethod: PaymentMethod;

  note?: string;

  items: CreateOrderItemRequest[];
}

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

export interface OrderItemDetail {
  id: string;

  productId: string;
  variantId: string;

  quantity: number;
  price: number;

  productName: string;
  productImage?: string;

  selectedAttributes?: Record<string, string>;
}

export interface OrderDetail {
  id: string;

  status: OrderStatus;
  statusLabel: string;

  pricing: OrderPricing;

  voucher: OrderVoucher | null;

  receiver: OrderReceiver;

  note?: string | null;

  items: OrderItemDetail[];

  createdAt: string;
  updatedAt: string;
}

/*Case create */
export interface CreateOrderResponse {
  order: OrderDetail;
  payment: OrderPaymentResponse;
}

export const createDefaultOrderPayload = (
  cartItems: CartItem[],
): CreateOrderRequest => ({
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",

  paymentMethod: PAYMENT_METHODS.COD,

  note: "",
  voucherCode: "",

  items: mapCartItemsToOrderItems(cartItems),
});
