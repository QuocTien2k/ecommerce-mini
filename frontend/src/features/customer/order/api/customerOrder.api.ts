import type { ApiResult } from "@shared/types/api-result";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersQuery,
  OrderDetail,
  OrderSummary,
} from "../types/customerOrder.type";
import { api } from "@shared/api/axios";
import type { PaginatedResponse } from "@shared/types/pagination";

export const customerOrderApi = {
  getOrders: (
    params?: GetOrdersQuery,
  ): ApiResult<PaginatedResponse<OrderSummary>> =>
    api.get("/order", { params }),

  getOrderDetail: (orderId: string): ApiResult<OrderDetail> =>
    api.get(`/order/${orderId}`),

  createOrder: (payload: CreateOrderRequest): ApiResult<CreateOrderResponse> =>
    api.post("/order", payload),
};
