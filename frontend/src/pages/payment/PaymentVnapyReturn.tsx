import { CUSTOMER_CART_QUERY_KEY } from "@features/customer/cart/constants/custom-cart.constant";
import { useVnpayReturn } from "@features/customer/payment/hooks/useVnpayReturn";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentVnPayReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useVnpayReturn();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    mutate(params, {
      onSuccess: async (response) => {
        const result = response.data;

        if (result.success && result.orderId) {
          await queryClient.invalidateQueries({
            queryKey: CUSTOMER_CART_QUERY_KEY.all,
          });

          navigate(`/order/${result.orderId}`);
          return;
        }

        navigate("/order-failed");
      },

      onError: () => {
        navigate("/order-failed");
      },
    });
  }, [location.search, mutate, navigate]);

  if (isPending) {
    return <div>Verifying payment...</div>;
  }

  return null;
};
