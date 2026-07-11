import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePaymentStatus } from "@features/customer/payment/hooks/usePaymentStatus";
import { PAYMENT_STATUSES } from "@features/customer/payment/types/payment.type";
import { useMomoReturn } from "@features/customer/payment/hooks/useMomoReturn";
import { useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_CART_QUERY_KEY } from "@features/customer/cart/constants/custom-cart.constant";

export const PaymentMomoReturn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { mutate } = useMomoReturn();

  const orderId = useMemo(() => {
    const transactionRef = searchParams.get("orderId") ?? "";

    // transactionRef = {orderId}-{timestamp}
    return transactionRef.replace(/-\d+$/, "");
  }, [searchParams]);

  const { data, isLoading } = usePaymentStatus(orderId);

  useEffect(() => {
    if (!data) return;

    const handleSuccess = async () => {
      const status = data.data.status;

      if (status === PAYMENT_STATUSES.SUCCESS) {
        await queryClient.invalidateQueries({
          queryKey: CUSTOMER_CART_QUERY_KEY.all,
        });

        navigate(`/order/${orderId}`, { replace: true });
        return;
      }

      if (
        status === PAYMENT_STATUSES.FAILED ||
        status === PAYMENT_STATUSES.CANCELLED
      ) {
        navigate("/order-failed", { replace: true });
      }
    };

    handleSuccess();
  }, [data, navigate, orderId, queryClient]);

  useEffect(() => {
    mutate(searchParams);
  }, [mutate, searchParams]);

  if (isLoading) {
    return <div>Đang xác nhận thanh toán...</div>;
  }

  return <div>Đang xử lý kết quả thanh toán...</div>;
};
