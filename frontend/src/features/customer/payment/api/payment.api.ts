import type {
  CodPaymentResponse,
  MomoPaymentResponse,
  VnpayPaymentResponse,
  VnpayReturnResponse,
} from "@features/customer/payment/types/payment.type";
import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";

export const customerPaymentApi = {
  createVnpay: (orderId: string): ApiResult<VnpayPaymentResponse> =>
    api.post("/payment/vnpay", { orderId }),

  createMomo: (orderId: string): ApiResult<MomoPaymentResponse> =>
    api.post(`/payment/momo/${orderId}`),

  createCod: (orderId: string): ApiResult<CodPaymentResponse> =>
    api.post(`/payment/cod/${orderId}`),

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
