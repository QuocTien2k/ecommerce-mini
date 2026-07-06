import { Title } from "@components/ui/title-module";
import DashboardOverview from "./components/DashboardOverview";
import DashboardRevenue from "./components/revenue/DashboardRevenueChart";
import DashboardTopProducts from "./components/top-product/DashboardTopProducts";
import DashboardOrderStatusChart from "./components/DashboardOrderStatusChart";
import DashboardMonthlyOrderChart from "./components/monthly-orders/DashboardMonthlyOrderChart";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <Title
        title="Dashboard"
        description="Tổng quan hoạt động và thống kê hệ thống."
        titleClassName="text-4xl font-bold"
      />

      <DashboardOverview />

      <DashboardRevenue />

      <DashboardMonthlyOrderChart />

      <DashboardOrderStatusChart />

      <DashboardTopProducts />
    </div>
  );
};

export default DashboardPage;
