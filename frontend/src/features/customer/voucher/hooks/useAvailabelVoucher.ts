import { useQuery } from "@tanstack/react-query";
import { customerVoucherApi } from "../api/customerVoucher.api";

export const CUSTOMER_AVAILABLE_VOUCHER_QUERY_KEY = "available-vouchers";

export const useGetAvailableVouchers = (subtotal?: number) => {
  return useQuery({
    queryKey: ["available-vouchers", subtotal],
    queryFn: () => customerVoucherApi.getAvailableVouchers(subtotal!),
    enabled: !!subtotal,
  });
};
