import type { CartItem } from "@features/customer/cart/types/customer-cart.type";
import type { CreateOrderItemRequest } from "../types/customerOrder.type";

export const mapCartItemsToOrderItems = (
  cartItems: CartItem[],
): CreateOrderItemRequest[] => {
  return cartItems.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
  }));
};
