import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";

export const customerPaymentApi = {
  createVnpay: (
    orderId: string,
  ): ApiResult<{ paymentUrl: string; paymentId: string }> =>
    api.post("/payment/vnpay", { orderId }),

  getStatus: (
    orderId: string,
  ): ApiResult<{
    status: string;
    message: string;
    orderId?: string;
  }> => api.get(`/payment/status/${orderId}`),
};
