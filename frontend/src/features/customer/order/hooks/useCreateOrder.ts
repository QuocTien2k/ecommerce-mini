import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderRequest } from "../types/customerOrder.type";
import { customerOrderApi } from "../api/customerOrder.api";
import { CUSTOMER_CART_QUERY_KEY } from "@features/customer/cart/constants/custom-cart.constant";
import { CUSTOMER_ORDER_QUERY_KEY } from "../constant/order";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) =>
      customerOrderApi.createOrder(payload),

    onSuccess: async (response) => {
      // console.log(
      //   "Log 1: ",
      //   queryClient.getQueryData([CUSTOMER_CART_QUERY_KEY]),
      // );

      const { order } = response.data;

      // await queryClient.invalidateQueries({
      //   queryKey: CUSTOMER_CART_QUERY_KEY.all,
      // });
      await queryClient.refetchQueries({
        queryKey: [CUSTOMER_CART_QUERY_KEY],
        type: "active",
      });

      queryClient.setQueryData(
        CUSTOMER_ORDER_QUERY_KEY.detail(order.id),
        order,
      );

      // console.log(
      //   "Log 2: ",
      //   queryClient.getQueryData([CUSTOMER_CART_QUERY_KEY]),
      // );
    },
  });
};
