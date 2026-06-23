import type { ApiResult } from "@shared/types/api-result";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderDetail,
} from "../types/customerOrder.type";
import { api } from "@shared/api/axios";

export const customerOrderApi = {
  getOrderDetail: (orderId: string): ApiResult<OrderDetail> =>
    api.get(`/order/${orderId}`),

  createOrder: (payload: CreateOrderRequest): ApiResult<CreateOrderResponse> =>
    api.post("/order", payload),
};
