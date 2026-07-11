import { useMutation } from "@tanstack/react-query";
import { customerPaymentApi } from "../api/payment.api";

export const useMomoReturn = () => {
  return useMutation({
    mutationFn: (params: URLSearchParams) =>
      customerPaymentApi.momoReturn(params),
  });
};
