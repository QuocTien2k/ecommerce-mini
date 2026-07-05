import { Title } from "@components/ui/title-module";
import DashboardOverview from "./components/DashboardOverview";
import DashboardRevenue from "./components/revenue/DashboardRevenueChart";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <Title
        title="Dashboard"
        description="Tổng quan hoạt động và thống kê hệ thống."
      />
      <DashboardOverview />

      <DashboardRevenue />
    </div>
  );
};

export default DashboardPage;
