import type { ApiResult } from "@shared/types/api-result";
import type {
  DashboardOverview,
  DashboardRevenueFilter,
  DashboardRevenueItem,
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
};
