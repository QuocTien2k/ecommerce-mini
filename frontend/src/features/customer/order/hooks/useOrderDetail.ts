import { useQuery } from "@tanstack/react-query";
import { customerOrderApi } from "../api/customerOrder.api";
import { CUSTOMER_ORDER_QUERY_KEY } from "../constant/order";

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: CUSTOMER_ORDER_QUERY_KEY.detail(orderId),
    queryFn: async () => {
      const res = await customerOrderApi.getOrderDetail(orderId);
      return res.data;
    },
    enabled: !!orderId,
  });
};
