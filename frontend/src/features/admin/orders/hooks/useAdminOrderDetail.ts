import { useQuery } from "@tanstack/react-query";
import { ADMIN_ORDER_QUERY_KEY } from "../constant/admin-order.constant";
import { adminOrderApi } from "../api/adminOrder.api";

export const useAdminOrderDetail = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ADMIN_ORDER_QUERY_KEY.detail(orderId),
    queryFn: async () => {
      const res = await adminOrderApi.getOrderDetail(orderId);
      return res.data;
    },
    enabled: enabled && !!orderId,
  });
};
