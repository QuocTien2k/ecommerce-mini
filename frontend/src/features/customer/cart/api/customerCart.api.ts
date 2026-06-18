import type { ApiResult } from "@shared/types/api-result";
import type {
  AddToCartPayload,
  CartResponse,
  UpdateCartItemPayload,
} from "../types/customer-cart.type";
import { api } from "@shared/api/axios";

export const customerCartApi = {
  getCart: (): ApiResult<CartResponse> => api.get("/cart-items"),

  addToCart: (payload: AddToCartPayload): ApiResult<CartResponse> =>
    api.post("/cart-items", payload),

  updateCartItem: (
    cartItemId: string,
    payload: UpdateCartItemPayload,
  ): ApiResult<CartResponse> => api.patch(`/cart-items/${cartItemId}`, payload),

  deleteCartItem: (cartItemId: string): ApiResult<CartResponse> =>
    api.delete(`/cart-items/${cartItemId}`),
};
