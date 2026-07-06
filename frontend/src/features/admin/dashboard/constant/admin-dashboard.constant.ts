import type {
  DashboardRevenueFilter,
  DashboardTopProductsFilter,
} from "../types/admin-dashboard.type";

export const ADMIN_DASHBOARD_QUERY_KEY = {
  all: ["admin-dashboard"] as const,

  overview: () => [...ADMIN_DASHBOARD_QUERY_KEY.all, "overview"] as const,

  revenue: (params?: DashboardRevenueFilter) =>
    [...ADMIN_DASHBOARD_QUERY_KEY.all, "revenue", params] as const,

  //   monthlyOrders: (params?: DashboardRevenueFilter) =>
  //     [...ADMIN_DASHBOARD_QUERY_KEY.all, "monthly-orders", params] as const,

  orderStatus: () =>
    [...ADMIN_DASHBOARD_QUERY_KEY.all, "order-status"] as const,

  topProducts: (params?: DashboardTopProductsFilter) =>
    [...ADMIN_DASHBOARD_QUERY_KEY.all, "top-products", params] as const,
};
