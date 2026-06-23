import type { VnpayReturnResponse } from "@features/customer/order/types/payment.type";
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

  vnpayReturn: (params: URLSearchParams): ApiResult<VnpayReturnResponse> =>
    api.get("/payment/vnpay/return", { params }),
};
