import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DashboardTopProductMetric,
  type DashboardTopProductMetric as DashboardTopProductMetricType,
} from "@/features/admin/dashboard/types/admin-dashboard.type";

type TopProductsMetricSelectProps = {
  value: DashboardTopProductMetricType;
  onValueChange: (value: DashboardTopProductMetricType) => void;
};

const options = [
  {
    value: DashboardTopProductMetric.QUANTITY,
    label: "Số lượng bán",
  },
  {
    value: DashboardTopProductMetric.REVENUE,
    label: "Doanh thu",
  },
  {
    value: DashboardTopProductMetric.ORDERS,
    label: "Đơn hàng",
  },
  {
    value: DashboardTopProductMetric.RATING,
    label: "Đánh giá",
  },
];

export default function TopProductsMetricSelect({
  value,
  onValueChange,
}: TopProductsMetricSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) =>
        onValueChange(value as DashboardTopProductMetricType)
      }
    >
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>

      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
