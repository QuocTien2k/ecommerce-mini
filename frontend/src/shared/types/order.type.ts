import type { OrderStatus } from "@features/customer/order/types/order-status.type";

export interface GetOrdersQuery {
  orderId?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  thumbnail: string | null;
  totalPrice: string;
  itemCount: number;

  createdAt: string;
}
