import { adminVoucherApi } from "../api/adminVoucher.api";
import type { AssignVoucherPayload } from "../types/admin-voucher.type";
import { useMutation } from "@tanstack/react-query";

export type AssignVoucherFormValues = {
  voucherId: string;
  data: AssignVoucherPayload;
};

export const useAdminAssignVoucher = () => {
  return useMutation({
    mutationFn: ({ voucherId, data }: AssignVoucherFormValues) =>
      adminVoucherApi.assignVoucher(voucherId, data),
  });
};
