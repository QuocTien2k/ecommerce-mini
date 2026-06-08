import { useQuery } from "@tanstack/react-query";
import { customerVoucherApi } from "../api/customerVoucher.api";
import type { GetMyVouchersQuery } from "../types/customer.type";

export const MY_VOUCHERS_QUERY_KEY = "my-vouchers";

export const useMyVouchersQuery = (params?: GetMyVouchersQuery) => {
  return useQuery({
    queryKey: [MY_VOUCHERS_QUERY_KEY, params],

    queryFn: () => customerVoucherApi.getMyVouchers(params),

    placeholderData: (prev) => prev,
  });
};
