import { useQuery } from "@tanstack/react-query";
import { ADMIN_DASHBOARD_QUERY_KEY } from "../constant/admin-dashboard.constant";
import { adminDashboard } from "../api/adminDashboard.apit";
import type {
  DashboardRevenueFilter,
  DashboardTopProductsFilter,
} from "../types/admin-dashboard.type";

/* Case overview */
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY.overview(),
    queryFn: async () => {
      const res = await adminDashboard.getOverview();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/* Case revenue */
export const useDashboardRevenue = (params?: DashboardRevenueFilter) => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY.revenue(params),
    queryFn: async () => {
      const res = await adminDashboard.getRevenue(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/* Case top products */
export const useDashboardTopProducts = (
  params?: DashboardTopProductsFilter,
) => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY.topProducts(params),
    queryFn: async () => {
      const res = await adminDashboard.getTopProducts(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/* Case order status */
export const useDashboardOrderStatus = () => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY.orderStatus(),
    queryFn: async () => {
      const res = await adminDashboard.getOrderStatus();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/* Case monthly orders */
export const useDashboardMonthlyOrders = (params?: DashboardRevenueFilter) => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY.monthlyOrders(params),
    queryFn: async () => {
      const res = await adminDashboard.getMonthlyOrders(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
