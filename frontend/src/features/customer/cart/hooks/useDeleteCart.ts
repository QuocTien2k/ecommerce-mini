import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerCartApi } from "../api/customerCart.api";
import { CUSTOMER_CART_QUERY_KEY } from "../constants/custom-cart.constant";

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) =>
      customerCartApi.deleteCartItem(cartItemId),

    onSuccess: (response) => {
      queryClient.setQueryData([CUSTOMER_CART_QUERY_KEY], response);
    },
  });
};
