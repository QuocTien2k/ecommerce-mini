import type { AvailableVoucher } from "@features/customer/voucher/types/customer.type";

export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export type CartItemAttributes = Record<string, string>;

export interface CartItem {
  id: string;

  productId: string;
  variantId: string;

  productName: string;

  image?: string;

  color?: string;
  attributes?: CartItemAttributes;
  stock: number;
  price: number;
  quantity: number;

  totalPrice: number;
}

export interface CartResponse {
  items: CartItem[];

  totalItems: number;
  totalQuantity: number;
  totalPrice: number;

  availableVouchers: AvailableVoucher[];
}

export interface UpdateCartItemPayload {
  quantity: number;
}
