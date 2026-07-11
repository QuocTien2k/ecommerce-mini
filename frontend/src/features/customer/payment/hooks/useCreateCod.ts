import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerPaymentApi } from "../api/payment.api";
import { CUSTOMER_CART_QUERY_KEY } from "@features/customer/cart/constants/custom-cart.constant";

export const useCreateCodPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => customerPaymentApi.createCod(orderId),

    onSuccess: async (res) => {
      if (!res.status) return;

      await queryClient.invalidateQueries({
        queryKey: CUSTOMER_CART_QUERY_KEY.all,
      });
    },
  });
};
