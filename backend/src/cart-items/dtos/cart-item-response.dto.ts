export class CartItemResponseDto {
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

export class CartResponseDto {
  items: CartItemResponseDto[];

  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}
