import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
import { monthlyOrderChartConfig } from "./monthly-order-chart.config";
import { useDashboardMonthlyOrders } from "../../hooks/useAdminDashboard";
import DashboardYearSelect from "../DashboardYearSelec";
import { Spinner } from "@components/ui/spinner";

export default function DashboardMonthlyOrderChart() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);

  const { data = [], isLoading } = useDashboardMonthlyOrders({
    year,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Đơn hàng</CardTitle>

          <CardDescription>
            Thống kê số lượng đơn hàng theo từng tháng
          </CardDescription>
        </div>

        <DashboardYearSelect value={year} onValueChange={setYear} />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ChartContainer
            config={monthlyOrderChartConfig}
            className="h-80 w-full"
          >
            <BarChart data={data}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dashed"
                    labelFormatter={(label) => `Tháng ${label.slice(1)}`}
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-6">
                        <span className="text-muted-foreground">Đơn hàng</span>

                        <span className="font-mono font-medium tabular-nums">
                          {value}
                        </span>
                      </div>
                    )}
                  />
                }
              />

              <Bar
                dataKey="orders"
                fill="var(--color-orders)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
