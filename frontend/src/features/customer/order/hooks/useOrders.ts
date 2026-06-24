import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_ORDER_QUERY_KEY } from "../constanst/order";
import type { GetOrdersQuery } from "../types/customerOrder.type";
import { customerOrderApi } from "../api/customerOrder.api";

export const useOrders = (params?: GetOrdersQuery) => {
  return useQuery({
    queryKey: CUSTOMER_ORDER_QUERY_KEY.list(params),
    queryFn: async () => {
      const res = await customerOrderApi.getOrders(params);
      return res.data;
    },
  });
};
