import type { ApiResult } from "@shared/types/api-result";
import type { GetMyVouchersQuery, UserVoucher } from "../types/customer.type";
import type { PaginatedResponse } from "@shared/types/pagination";
import { api } from "@shared/api/axios";

export const customerVoucherApi = {
  getMyVouchers: (
    params?: GetMyVouchersQuery,
  ): ApiResult<PaginatedResponse<UserVoucher>> =>
    api.get("/voucher/user", { params }),
};
