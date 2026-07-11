import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerCartApi } from "../api/customerCart.api";
import { CUSTOMER_CART_QUERY_KEY } from "../constants/custom-cart.constant";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) =>
      customerCartApi.updateCartItem(cartItemId, {
        quantity,
      }),

    onSuccess: (response) => {
      queryClient.setQueryData(CUSTOMER_CART_QUERY_KEY.all, response);
    },
  });
};
