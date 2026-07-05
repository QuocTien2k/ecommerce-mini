import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  DashboardTopProductMetric,
  type DashboardTopProductMetric as DashboardTopProductMetricType,
} from "@/features/admin/dashboard/types/admin-dashboard.type";
import { useDashboardTopProducts } from "../../hooks/useAdminDashboard";
import { formatCurrency } from "@lib/format-currency";
import TopProductsMetricSelect from "./TopProductsMetricSelect";
import TopProductsDaySelect from "./TopProductsDaysSelect";
import { Spinner } from "@components/ui/spinner";
import { topProductChartConfig } from "./top-products-chart.config";
import ProductTick from "./ProductTick";

const metricLabels: Record<DashboardTopProductMetricType, string> = {
  quantity: "Số lượng bán",
  revenue: "Doanh thu",
  orders: "Đơn hàng",
  rating: "Đánh giá",
};

export default function DashboardTopProducts() {
  const [metric, setMetric] = useState<DashboardTopProductMetricType>(
    DashboardTopProductMetric.QUANTITY,
  );

  const [days, setDays] = useState(30);

  const { data = [], isLoading } = useDashboardTopProducts({
    metric,
    days,
  });

  const formatValue = (value: number | string) => {
    switch (metric) {
      case DashboardTopProductMetric.REVENUE:
        return formatCurrency(value);

      case DashboardTopProductMetric.RATING:
        return `${value} ⭐`;

      case DashboardTopProductMetric.ORDERS:
        return `${value} đơn`;

      default:
        return `${value} sản phẩm`;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Top sản phẩm</CardTitle>

          <CardDescription>
            Thống kê sản phẩm nổi bật theo từng tiêu chí
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <TopProductsMetricSelect value={metric} onValueChange={setMetric} />

          <TopProductsDaySelect value={days} onValueChange={setDays} />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ChartContainer
            config={topProductChartConfig}
            className="h-80 w-full"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                left: 20,
                right: 20,
              }}
            >
              <CartesianGrid horizontal={false} />

              <XAxis type="number" tickLine={false} axisLine={false} />

              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={<ProductTick />}
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(label) => String(label)}
                    formatter={(value, _, item) => {
                      const product = item.payload;

                      return (
                        <div className="flex w-full items-center justify-between gap-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />

                            <span className="text-muted-foreground">
                              {metricLabels[metric]}
                            </span>
                          </div>

                          <span className="font-mono font-medium tabular-nums">
                            {formatValue(
                              Array.isArray(value) ? value[0] : value,
                            )}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />

              <Bar dataKey="value" radius={6} barSize={18} fill="#93c5fd" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
