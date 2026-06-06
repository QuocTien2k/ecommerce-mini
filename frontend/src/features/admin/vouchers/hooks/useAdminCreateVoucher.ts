import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_VOUCHERS_QUERY_KEY } from "./useAdminVoucherQuery";
import { adminVoucherApi } from "../api/adminVoucher.api";
import type { CreateVoucherPayload } from "../types/admin-voucher.type";

export const useAdminCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVoucherPayload) =>
      adminVoucherApi.createVoucher(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_VOUCHERS_QUERY_KEY],
      });
    },
  });
};
