import type { ApiResult } from "@shared/types/api-result";
import type { DashboardOverview } from "../types/admin-dashboard.type";
import { api } from "@shared/api/axios";

export const adminDashboard = {
  getOverview: (): ApiResult<DashboardOverview> =>
    api.get("/dashboard/overview"),
};
