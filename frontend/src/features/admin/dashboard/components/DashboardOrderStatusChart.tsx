import { Pie, PieChart } from "recharts";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { useDashboardOrderStatus } from "../hooks/useAdminDashboard";
import { Spinner } from "@components/ui/spinner";

const chartConfig = {
  pending: {
    label: "Chờ xác nhận",
    color: "#facc15", // yellow-400
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "#3b82f6", // blue-500
  },
  processing: {
    label: "Đang xử lý",
    color: "#6366f1", // indigo-500
  },
  readyToShip: {
    label: "Sẵn sàng giao",
    color: "#06b6d4", // cyan-500
  },
  shipping: {
    label: "Đang giao",
    color: "#a855f7", // purple-500
  },
  delivered: {
    label: "Đã giao",
    color: "#22c55e", // green-500
  },
  cancelled: {
    label: "Đã hủy",
    color: "#ef4444", // red-500
  },
} satisfies ChartConfig;

const STATUS_COLORS = {
  pending: "#facc15",
  confirmed: "#3b82f6",
  processing: "#6366f1",
  readyToShip: "#06b6d4",
  shipping: "#a855f7",
  delivered: "#22c55e",
  cancelled: "#ef4444",
} as const;

export default function DashboardOrderStatusChart() {
  const { data, isLoading } = useDashboardOrderStatus();

  const chartData = data
    ? [
        {
          status: "pending",
          label: "Chờ xác nhận",
          value: data.pending,
          fill: STATUS_COLORS.pending,
        },
        {
          status: "confirmed",
          label: "Đã xác nhận",
          value: data.confirmed,
          fill: STATUS_COLORS.confirmed,
        },
        {
          status: "processing",
          label: "Đang xử lý",
          value: data.processing,
          fill: STATUS_COLORS.processing,
        },
        {
          status: "readyToShip",
          label: "Sẵn sàng giao",
          value: data.readyToShip,
          fill: STATUS_COLORS.readyToShip,
        },
        {
          status: "shipping",
          label: "Đang giao",
          value: data.shipping,
          fill: STATUS_COLORS.shipping,
        },
        {
          status: "delivered",
          label: "Đã giao",
          value: data.delivered,
          fill: STATUS_COLORS.delivered,
        },
        {
          status: "cancelled",
          label: "Đã hủy",
          value: data.cancelled,
          fill: STATUS_COLORS.cancelled,
        },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Trạng thái đơn hàng
        </CardTitle>
        <CardDescription>Phân bố đơn hàng theo trạng thái</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-8">
            <ChartContainer config={chartConfig} className="h-80 w-80">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={70}
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>

            <div className="w-56 space-y-3">
              {chartData.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                  </div>

                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
