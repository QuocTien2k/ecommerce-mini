import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerCartApi } from "../api/customerCart.api";
import type {
  AddToCartPayload,
  CartResponse,
} from "../types/customer-cart.type";
import { CUSTOMER_CART_QUERY_KEY } from "../constants/custom-cart.constant";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      customerCartApi.addToCart(payload),

    onSuccess: (response) => {
      queryClient.setQueryData<CartResponse>(
        [CUSTOMER_CART_QUERY_KEY],
        response.data,
      );
    },
  });
};
