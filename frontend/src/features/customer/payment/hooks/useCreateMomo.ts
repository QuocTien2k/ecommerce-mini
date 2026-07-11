import { useMutation } from "@tanstack/react-query";
import { customerPaymentApi } from "../api/payment.api";

export const useCreateMomoPayment = () => {
  return useMutation({
    mutationFn: (orderId: string) => customerPaymentApi.createMomo(orderId),

    onSuccess: (res) => {
      if (!res.status) return;

      const paymentUrl = res.data.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
  });
};
