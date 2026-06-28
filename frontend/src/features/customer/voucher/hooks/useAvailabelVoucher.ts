import { useQuery } from "@tanstack/react-query";
import { customerVoucherApi } from "../api/customerVoucher.api";

export const CUSTOMER_AVAILABLE_VOUCHER_QUERY_KEY = "available-vouchers";

export const useGetAvailableVouchers = () => {
  return useQuery({
    queryKey: [CUSTOMER_AVAILABLE_VOUCHER_QUERY_KEY],
    queryFn: () => customerVoucherApi.getAvailableVouchers(),
  });
};
