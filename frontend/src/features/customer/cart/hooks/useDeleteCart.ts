import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerCartApi } from "../api/customerCart.api";
import type { CartResponse } from "../types/customer-cart.type";
import { CUSTOMER_CART_QUERY_KEY } from "../constants/custom-cart.constant";

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) =>
      customerCartApi.deleteCartItem(cartItemId),

    onSuccess: (response) => {
      queryClient.setQueryData<CartResponse>(
        [CUSTOMER_CART_QUERY_KEY],
        response.data,
      );
    },
  });
};
