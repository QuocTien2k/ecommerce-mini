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

/* Case top product */
export interface DashboardTopProduct {
  productId: string;
  name: string;
  thumbnail: string;
  value: number;
}

export const DashboardTopProductMetric = {
  QUANTITY: "quantity",
  REVENUE: "revenue",
  ORDERS: "orders",
  RATING: "rating",
} as const;

export type DashboardTopProductMetric =
  (typeof DashboardTopProductMetric)[keyof typeof DashboardTopProductMetric];

export interface DashboardTopProductsFilter {
  metric?: DashboardTopProductMetric;
  days?: number;
  limit?: number;
}
