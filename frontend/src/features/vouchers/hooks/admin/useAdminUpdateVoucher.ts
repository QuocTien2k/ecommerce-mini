import { adminVoucherApi } from "@features/vouchers/api/adminVoucher.api";
import type { UpdateVoucherPayload } from "@features/vouchers/types/admin-voucher.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_VOUCHERS_QUERY_KEY } from "./useAdminVoucherQuery";

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

    onSuccess: () => {
      // invalidate list only
      queryClient.invalidateQueries({
        queryKey: [ADMIN_VOUCHERS_QUERY_KEY],
      });
    },
  });
};
