import { useQuery } from "@tanstack/react-query";
import { customerOrderApi } from "../api/customerOrder.api";

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: async () => {
      const res = await customerOrderApi.getOrderDetail(orderId);
      return res.data;
    },
    enabled: !!orderId,
  });
};
