export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface CartItem {
  id: string;

  productId: string;
  variantId: string;

  productName: string;

  image?: string;

  color?: string;
  attributes?: Record<string, any>;

  price: number;
  quantity: number;

  totalPrice: number;
}

export interface CartResponse {
  items: CartItem[];

  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
