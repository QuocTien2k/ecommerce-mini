import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type {
  GetOrdersQuery,
  OrderDetail,
  OrderSummary,
} from "@shared/types/order.type";
import type { PaginatedResponse } from "@shared/types/pagination";
import type { UpdateOrderStatusRequest } from "../types/adimn-order.type";
import type { OrderStatus } from "@shared/types/order-status.type";

export const adminOrderApi = {
  getOrders: (
    params?: GetOrdersQuery,
  ): ApiResult<PaginatedResponse<OrderSummary>> =>
    api.get("/order", { params }),

  getOrderDetail: (orderId: string): ApiResult<OrderDetail> =>
    api.get(`/order/${orderId}`),

  updateOrderStatus: (
    orderId: string,
    data: UpdateOrderStatusRequest,
  ): ApiResult<OrderDetail> => api.patch(`/order/${orderId}`, data),

  exportOrders: (params?: GetOrdersQuery) =>
    api.get("/order/export", {
      params,
      responseType: "blob",
    }),
};
