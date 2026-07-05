/* Case overview */
export interface DashboardOverview {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  expectedRevenue: number;
}

/* Case revenue */
export interface DashboardRevenueItem {
  label: string;
  revenue: number;
}

export interface DashboardRevenueFilter {
  year?: number;
}
