import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOrderStatusRequest } from "../types/adimn-order.type";
import { adminOrderApi } from "../api/adminOrder.api";
import { ADMIN_ORDER_QUERY_KEY } from "../constant/admin-order.constant";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrderStatusRequest;
    }) => adminOrderApi.updateOrderStatus(orderId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDER_QUERY_KEY.detail(variables.orderId),
      });

      queryClient.invalidateQueries({
        queryKey: ADMIN_ORDER_QUERY_KEY.lists(),
      });
    },
  });
};
