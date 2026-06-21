import type { ApiResult } from "@shared/types/api-result";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from "../types/customerOrder.type";
import { api } from "@shared/api/axios";

export const customerOrderApi = {
  createOrder: (payload: CreateOrderRequest): ApiResult<CreateOrderResponse> =>
    api.post("/order", payload),
};
