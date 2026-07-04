export class DashboardMonthlyOrderItemDto {
  label: string;
  orders: number;
}

export type MonthlyOrderRow = {
  month: number;
  orders: number;
};
