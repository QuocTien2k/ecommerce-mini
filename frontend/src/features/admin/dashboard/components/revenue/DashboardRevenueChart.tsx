import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import RevenueYearSelect from "./RevenueYearSelect";
import { revenueChartConfig } from "./revenue-chart.config";

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
import { useDashboardRevenue } from "../../hooks/useAdminDashboard";
import { Spinner } from "@components/ui/spinner";
import { formatCurrency } from "@lib/format-currency";

export default function DashboardRevenue() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);

  const { data = [], isLoading } = useDashboardRevenue({
    year,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Doanh thu</CardTitle>

          <CardDescription>Thống kê doanh thu theo từng tháng</CardDescription>
        </div>

        <RevenueYearSelect value={year} onValueChange={setYear} />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ChartContainer config={revenueChartConfig} className="h-80 w-full">
            <AreaChart data={data}>
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
                    indicator="line"
                    labelFormatter={(label) => `Tháng ${label.slice(1)}`}
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-6">
                        <span className="text-muted-foreground">Doanh thu</span>

                        <span className="font-mono font-medium tabular-nums">
                          {formatCurrency(
                            Array.isArray(value) ? value[0] : value,
                          )}
                        </span>
                      </div>
                    )}
                  />
                }
              />

              <Area
                dataKey="revenue"
                type="monotone"
                fill="var(--color-revenue)"
                fillOpacity={0.25}
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
