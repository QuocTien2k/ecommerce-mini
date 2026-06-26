import type { OrderStatus } from "@shared/types/order-status.type";

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
