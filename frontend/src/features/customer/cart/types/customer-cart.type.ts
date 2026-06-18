export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface CartItem {
  id: string;

  productId: string;
  variantId: string;

  productName: string;
  productImage?: string;

  price: number;
  quantity: number;
  itemTotal: number;

  selectedAttributes?: Record<string, any>;
}

export interface CartResponse {
  items: CartItem[];

  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}
