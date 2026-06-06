import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_VOUCHERS_QUERY_KEY } from "./useAdminVoucherQuery";
import { adminVoucherApi } from "@features/admin/vouchers/api/adminVoucher.api";

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
