import { useQuery } from "@tanstack/react-query";
import { ADMIN_DASHBOARD_QUERY_KEY } from "../constant/admin-dashboard.constant";
import { adminDashboard } from "../api/adminDashboard.apit";

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
