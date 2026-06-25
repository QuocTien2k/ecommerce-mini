import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { GetOrdersQuery, OrderSummary } from "@shared/types/order.type";
import type { PaginatedResponse } from "@shared/types/pagination";

export const adminOrderApi = {
  getOrders: (
    params?: GetOrdersQuery,
  ): ApiResult<PaginatedResponse<OrderSummary>> =>
    api.get("/order", { params }),
};
