import type { VnpayReturnResponse } from "@features/customer/order/types/payment.type";
import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { CreatePaymentResponse } from "../types/create-payment.type";

export const customerPaymentApi = {
  createVnpay: (orderId: string): ApiResult<CreatePaymentResponse> =>
    api.post("/payment/vnpay", { orderId }),

  createMomo: (orderId: string): ApiResult<CreatePaymentResponse> =>
    api.post(`/payment/momo/${orderId}`),

  getStatus: (
    orderId: string,
  ): ApiResult<{
    status: string;
    message: string;
    orderId?: string;
  }> => api.get(`/payment/status/${orderId}`),

  vnpayReturn: (params: URLSearchParams): ApiResult<VnpayReturnResponse> =>
    api.get("/payment/vnpay/return", { params }),

  momoReturn: (
    params: URLSearchParams,
  ): ApiResult<{
    resultCode: number;
    message: string;
  }> => api.get("/payment/momo/return", { params }),
};
