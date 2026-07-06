import type { ApiResult } from "@shared/types/api-result";
import type {
  DashboardMonthlyOrderItem,
  DashboardOrderStatus,
  DashboardOverview,
  DashboardRevenueFilter,
  DashboardRevenueItem,
  DashboardTopProduct,
  DashboardTopProductsFilter,
} from "../types/admin-dashboard.type";
import { api } from "@shared/api/axios";

export const adminDashboard = {
  getOverview: (): ApiResult<DashboardOverview> =>
    api.get("/dashboard/overview"),

  getRevenue: (
    params?: DashboardRevenueFilter,
  ): ApiResult<DashboardRevenueItem[]> =>
    api.get("/dashboard/revenue", {
      params,
    }),

  getTopProducts: (
    params?: DashboardTopProductsFilter,
  ): ApiResult<DashboardTopProduct[]> =>
    api.get("/dashboard/top-products", {
      params,
    }),

  getOrderStatus: (): ApiResult<DashboardOrderStatus> =>
    api.get("/dashboard/order-status"),

  getMonthlyOrders: (
    params?: DashboardRevenueFilter,
  ): ApiResult<DashboardMonthlyOrderItem[]> =>
    api.get("/dashboard/monthly-orders", {
      params,
    }),
};
