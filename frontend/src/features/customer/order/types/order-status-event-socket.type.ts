import type { OrderStatus } from "@shared/types/order-status.type";

export type OrderStatusUpdatedEvent = {
  type: "ORDER_STATUS_UPDATED";
  id: string;
  title: string;
  message: string;
  path?: string;
  orderId: string;
  orderStatus: OrderStatus;
  isRead: boolean;
  createdAt: string;
};
