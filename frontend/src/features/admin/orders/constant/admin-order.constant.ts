import type { GetOrdersQuery } from "@shared/types/order.type";

const BASE = ["admin-orders"] as const;

export const ADMIN_ORDER_QUERY_KEY = {
  all: BASE,

  lists: () => [...BASE, "list"] as const,

  list: (params?: GetOrdersQuery) => [...BASE, "list", params] as const,

  detail: (orderId: string) => [...BASE, "detail", orderId] as const,
};
