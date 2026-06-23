import { useVnpayReturn } from "@features/customer/payment/hooks/useVnpayReturn";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate, isPending } = useVnpayReturn();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    mutate(params, {
      onSuccess: (response) => {
        const result = response.data;

        if (result.success) {
          navigate("/order-success");
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
