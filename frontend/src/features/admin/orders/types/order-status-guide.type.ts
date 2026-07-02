import type { OrderStatus } from "@shared/types/order-status.type";

export interface OrderStatusGuideItem {
  currentStatus: OrderStatus;
  nextStatuses: OrderStatus[];
}
