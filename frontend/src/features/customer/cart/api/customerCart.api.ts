import type { ApiResult } from "@shared/types/api-result";
import type {
  AddToCartPayload,
  CartResponse,
} from "../types/customer-cart.type";
import { api } from "@shared/api/axios";

export const customerCartApi = {
  addToCart: (payload: AddToCartPayload): ApiResult<CartResponse> =>
    api.post("/cart/add", payload),
};
