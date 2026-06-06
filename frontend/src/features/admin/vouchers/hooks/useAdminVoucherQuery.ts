import { useQuery } from "@tanstack/react-query";
import type { GetAdminVouchersQuery } from "../types/admin-voucher.type";
import { adminVoucherApi } from "../api/adminVoucher.api";

export const ADMIN_VOUCHERS_QUERY_KEY = "admin-vouchers";
export const ADMIN_VOUCHER_DETAIL_QUERY_KEY = "admin-voucher-detail";

export const useAdminVouchersQuery = (params?: GetAdminVouchersQuery) => {
  return useQuery({
    queryKey: [ADMIN_VOUCHERS_QUERY_KEY, params],

    queryFn: () => adminVoucherApi.getVouchers(params),

    placeholderData: (prev) => prev,
  });
};

export const useAdminVoucherDetailQuery = (voucherId?: string) => {
  return useQuery({
    queryKey: [ADMIN_VOUCHER_DETAIL_QUERY_KEY, voucherId],

    queryFn: () => adminVoucherApi.getVoucherDetail(voucherId!),

    enabled: !!voucherId,
  });
};
