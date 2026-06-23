import type { OrderStatus } from "@features/customer/order/types/order-status.type";

export const ORDER_TIMELINE = [
  {
    status: "PENDING" as OrderStatus,
    label: "Đã đặt hàng",
  },
  {
    status: "CONFIRMED" as OrderStatus,
    label: "Đã xác nhận",
  },
  {
    status: "PROCESSING" as OrderStatus,
    label: "Đang xử lý",
  },
  {
    status: "READY_TO_SHIP" as OrderStatus,
    label: "Đã xuất kho",
  },
  {
    status: "SHIPPING" as OrderStatus,
    label: "Đang vận chuyển",
  },
  {
    status: "DELIVERED" as OrderStatus,
    label: "Giao thành công",
  },
];

export const getOrderStepIndex = (status: OrderStatus): number => {
  return ORDER_TIMELINE.findIndex((step) => step.status === status);
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",

  CONFIRMED: "bg-blue-100 text-blue-700",

  PROCESSING: "bg-indigo-100 text-indigo-700",

  READY_TO_SHIP: "bg-cyan-100 text-cyan-700",

  SHIPPING: "bg-purple-100 text-purple-700",

  DELIVERED: "bg-green-100 text-green-700",

  CANCELLED: "bg-red-100 text-red-700",
};
