import type { GetOrdersQuery } from "@shared/types/order.type";
import { useQuery } from "@tanstack/react-query";
import { ADMIN_ORDER_QUERY_KEY } from "../constant/admin-order.constant";
import { adminOrderApi } from "../api/adminOrder.api";

export const useAdminOrders = (params?: GetOrdersQuery) => {
  return useQuery({
    queryKey: ADMIN_ORDER_QUERY_KEY.list(params),
    queryFn: async () => {
      const response = await adminOrderApi.getOrders(params);
      return response.data;
    },
  });
};
