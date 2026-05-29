import { adminVoucherApi } from "@features/vouchers/api/adminVoucher.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_VOUCHERS_QUERY_KEY } from "./useAdminVoucherQuery";

export const useAdminSoftDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voucherId: string) =>
      adminVoucherApi.softDeleteVoucher(voucherId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_VOUCHERS_QUERY_KEY],
      });
    },
  });
};
