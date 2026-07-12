import type { GetOrdersQuery } from "@shared/types/order.type";

const BASE = ["customer-orders"] as const;

export const CUSTOMER_ORDER_QUERY_KEY = {
  all: BASE,

  lists: () => [...BASE, "list"] as const,

  list: (params?: GetOrdersQuery) => [...BASE, "list", params] as const,

  detail: (orderId: string) => [...BASE, "detail", orderId] as const,
};
