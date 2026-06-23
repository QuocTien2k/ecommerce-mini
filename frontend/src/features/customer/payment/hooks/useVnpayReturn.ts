import { useMutation } from "@tanstack/react-query";
import { customerPaymentApi } from "../api/payment.api";

export const useVnpayReturn = () => {
  return useMutation({
    mutationFn: (params: URLSearchParams) =>
      customerPaymentApi.vnpayReturn(params),
  });
};
