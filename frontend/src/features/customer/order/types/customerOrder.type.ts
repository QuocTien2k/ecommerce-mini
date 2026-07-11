import type { CartItem } from "@features/customer/cart/types/customer-cart.type";
import {
  PAYMENT_METHODS,
  type OrderPaymentResponse,
  type PaymentMethod,
} from "../../payment/types/payment.type";
import { mapCartItemsToOrderItems } from "../mapper/buildOrderItem";
import type { OrderDetail } from "@shared/types/order.type";

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
