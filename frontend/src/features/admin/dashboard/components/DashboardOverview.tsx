import {
  Users,
  Package,
  ShoppingCart,
  Clock3,
  Wallet,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardOverview } from "../hooks/useAdminDashboard";
import { formatCurrency } from "@lib/format-currency";

const DashboardOverview = () => {
  const { data, isLoading } = useDashboardOverview();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return null;
  }

  const cards = [
    {
      title: "Người dùng",
      value: data.totalUsers,
      icon: Users,
    },
    {
      title: "Sản phẩm",
      value: data.totalProducts,
      icon: Package,
    },
    {
      title: "Đơn hàng",
      value: data.totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Đơn chờ xác nhận",
      value: data.pendingOrders,
      icon: Clock3,
    },
    {
      title: "Doanh thu",
      value: formatCurrency(data.totalRevenue),
      icon: Wallet,
    },
    {
      title: "Doanh thu dự kiến",
      value: formatCurrency(data.expectedRevenue),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardOverview;
