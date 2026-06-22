import { usePaymentStatus } from "@features/customer/payment/hooks/usePaymentStatus";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");

  const { data, isLoading } = usePaymentStatus(orderId || "");

  useEffect(() => {
    if (!data) return;

    const status = data.data.status;

    if (status === "SUCCESS") {
      navigate("/order-success");
      return;
    }

    if (status === "FAILED") {
      navigate("/order-failed");
      return;
    }
  }, [data, navigate]);

  if (isLoading) {
    return <div>Checking payment status...</div>;
  }

  return null;
};
