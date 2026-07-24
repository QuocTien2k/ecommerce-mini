import { ORDER_STATUSES } from "@shared/types/order-status.type";
import type { OrderStatusGuideItem } from "./order-status-guide.type";

export const ORDER_STATUS_GUIDE: OrderStatusGuideItem[] = [
  {
    currentStatus: ORDER_STATUSES.PENDING,
    nextStatuses: [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.CANCELLED],
  },
  {
    currentStatus: ORDER_STATUSES.CONFIRMED,
    nextStatuses: [ORDER_STATUSES.PROCESSING, ORDER_STATUSES.CANCELLED],
  },
  {
    currentStatus: ORDER_STATUSES.PROCESSING,
    nextStatuses: [ORDER_STATUSES.READY_TO_SHIP, ORDER_STATUSES.CANCELLED],
  },
  {
    currentStatus: ORDER_STATUSES.READY_TO_SHIP,
    nextStatuses: [ORDER_STATUSES.SHIPPING],
  },
  {
    currentStatus: ORDER_STATUSES.SHIPPING,
    nextStatuses: [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.DELIVERY_FAILED],
  },
  {
    currentStatus: ORDER_STATUSES.DELIVERED,
    nextStatuses: [],
  },
  {
    currentStatus: ORDER_STATUSES.DELIVERY_FAILED,
    nextStatuses: [],
  },
  {
    currentStatus: ORDER_STATUSES.CANCELLED,
    nextStatuses: [],
  },
];
