import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PaginatedResponse } from "@shared/types/pagination";
import type {
  AdminVoucher,
  CreateVoucherPayload,
  GetAdminVouchersQuery,
  UpdateVoucherPayload,
} from "../types/admin-voucher.type";

export const adminVoucherApi = {
  getVouchers: (
    params?: GetAdminVouchersQuery,
  ): ApiResult<PaginatedResponse<AdminVoucher>> =>
    api.get("/voucher/admin", { params }),

  createVoucher: (payload: CreateVoucherPayload): ApiResult<AdminVoucher> =>
    api.post("/voucher/admin", payload),

  updateVoucher: (
    id: string,
    payload: UpdateVoucherPayload,
  ): ApiResult<AdminVoucher> => api.patch(`/voucher/admin/${id}`, payload),
};
