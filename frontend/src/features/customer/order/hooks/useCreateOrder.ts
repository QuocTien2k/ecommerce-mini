import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_CART_QUERY_KEY } from "@features/customer/cart/constants/custom-cart.constant";
import type { CreateOrderRequest } from "../types/customerOrder.type";
import { customerOrderApi } from "../api/customerOrder.api";

export const CUSTOMER_ORDER_QUERY_KEY = "CUSTOMER_ORDER";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) =>
      customerOrderApi.createOrder(payload),

    onSuccess: (response) => {
      const { order } = response.data;

      // update or invalidate cart (vì order tạo xong thì cart thay đổi)
      queryClient.invalidateQueries({
        queryKey: [CUSTOMER_CART_QUERY_KEY],
      });

      // optional: cache order detail ngay lập tức
      queryClient.setQueryData([CUSTOMER_ORDER_QUERY_KEY, order.id], order);
    },
  });
};
