import type { OrderStatus } from "@features/customer/order/types/order-status.type";

/**
 * FLOW STATUS: dùng cho progress tracking (user + admin detail)
 * Không bao gồm CANCELLED
 */
export const ORDER_FLOW_TIMELINE: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_TO_SHIP",
  "SHIPPING",
  "DELIVERED",
];

/**
 * TERMINAL STATUS: không thuộc flow chính
 */
export const ORDER_TERMINAL_STATUS: OrderStatus[] = ["CANCELLED"];

/**
 * LABEL hiển thị (dùng cho admin + user UI)
 */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Đã đặt hàng",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  READY_TO_SHIP: "Đã xuất kho",
  SHIPPING: "Đang vận chuyển",
  DELIVERED: "Giao thành công",
  CANCELLED: "Đã huỷ",
};

/**
 * COLOR badge (UI-only, không dùng cho logic)
 */
export const ORDER_STATUS_COLORS: Partial<Record<OrderStatus, string>> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  READY_TO_SHIP: "bg-cyan-100 text-cyan-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

/**
 * Get label safe
 */
export const getOrderStatusLabel = (status: OrderStatus): string => {
  return ORDER_STATUS_LABEL[status] ?? status;
};

/**
 * Get color safe
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  return ORDER_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
};

/**
 * Get index trong flow (dùng cho progress UI)
 * return -1 nếu status không thuộc flow (vd CANCELLED)
 */
export const getOrderStepIndex = (status: OrderStatus): number => {
  return ORDER_FLOW_TIMELINE.indexOf(status);
};

/**
 * Check status thuộc flow hay không
 */
export const isInOrderFlow = (status: OrderStatus): boolean => {
  return ORDER_FLOW_TIMELINE.includes(status);
};

/**
 * Check terminal status
 */
export const isTerminalOrderStatus = (status: OrderStatus): boolean => {
  return ORDER_TERMINAL_STATUS.includes(status);
};
