import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_ORDER_QUERY_KEY } from "../components/constant/order";
import { customerOrderApi } from "../api/customerOrder.api";
import type { GetOrdersQuery } from "@shared/types/order.type";

export const useOrders = (params?: GetOrdersQuery) => {
  return useQuery({
    queryKey: CUSTOMER_ORDER_QUERY_KEY.list(params),
    queryFn: async () => {
      const res = await customerOrderApi.getOrders(params);
      return res.data;
    },
  });
};
