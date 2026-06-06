import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ADMIN_VOUCHER_DETAIL_QUERY_KEY,
  ADMIN_VOUCHERS_QUERY_KEY,
} from "./useAdminVoucherQuery";
import type { UpdateVoucherPayload } from "../../types/admin-voucher.type";
import { adminVoucherApi } from "../../api/adminVoucher.api";

export type UpdateVoucherFormValues = {
  id: string;
  data: UpdateVoucherPayload;
};

export const useAdminUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateVoucherFormValues) => {
      return await adminVoucherApi.updateVoucher(id, data);
    },

    onSuccess: (_, variables) => {
      // invalidate list only
      queryClient.invalidateQueries({
        queryKey: [ADMIN_VOUCHERS_QUERY_KEY],
      });

      // invalidate detail
      queryClient.invalidateQueries({
        queryKey: [ADMIN_VOUCHER_DETAIL_QUERY_KEY, variables.id],
      });
    },
  });
};
