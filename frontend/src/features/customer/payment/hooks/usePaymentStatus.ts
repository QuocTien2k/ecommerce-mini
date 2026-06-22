import { useQuery } from "@tanstack/react-query";
import { customerPaymentApi } from "../api/payment.api";

export const usePaymentStatus = (orderId: string) => {
  return useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => customerPaymentApi.getStatus(orderId),
    enabled: !!orderId,
    refetchInterval: 2000, // optional polling
  });
};
