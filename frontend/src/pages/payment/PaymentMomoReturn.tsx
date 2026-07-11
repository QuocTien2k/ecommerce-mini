import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePaymentStatus } from "@features/customer/payment/hooks/usePaymentStatus";
import { PAYMENT_STATUSES } from "@features/customer/order/types/payment.type";
import { useMomoReturn } from "@features/customer/payment/hooks/useMomoReturn";

export const PaymentMomoReturn = () => {
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

    const status = data.data.status;

    if (status === PAYMENT_STATUSES.SUCCESS) {
      navigate(`/order/${orderId}`, { replace: true });
      return;
    }

    if (
      status === PAYMENT_STATUSES.FAILED ||
      status === PAYMENT_STATUSES.CANCELLED
    ) {
      navigate("/order-failed", { replace: true });
    }
  }, [data, navigate, orderId]);

  useEffect(() => {
    mutate(searchParams);
  }, [mutate, searchParams]);

  if (isLoading) {
    return <div>Đang xác nhận thanh toán...</div>;
  }

  return <div>Đang xử lý kết quả thanh toán...</div>;
};
