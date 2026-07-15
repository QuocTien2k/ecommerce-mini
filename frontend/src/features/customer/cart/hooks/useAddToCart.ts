import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerCartApi } from "../api/customerCart.api";
import type { AddToCartPayload } from "../types/customer-cart.type";
import { CUSTOMER_CART_QUERY_KEY } from "../constants/custom-cart.constant";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      customerCartApi.addToCart(payload),

    onSuccess: () => {
      // console.log(
      //   "Before:",
      //   queryClient.getQueryData([CUSTOMER_CART_QUERY_KEY]),
      // );

      queryClient.invalidateQueries({ queryKey: CUSTOMER_CART_QUERY_KEY.all });

      // console.log(
      //   "After:",
      //   queryClient.getQueryData([CUSTOMER_CART_QUERY_KEY]),
      // );
    },
  });
};
