import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type {
  GetOrdersQuery,
  OrderDetail,
  OrderSummary,
} from "@shared/types/order.type";
import type { PaginatedResponse } from "@shared/types/pagination";

export const adminOrderApi = {
  getOrders: (
    params?: GetOrdersQuery,
  ): ApiResult<PaginatedResponse<OrderSummary>> =>
    api.get("/order", { params }),

  getOrderDetail: (orderId: string): ApiResult<OrderDetail> =>
    api.get(`/order/${orderId}`),
};
