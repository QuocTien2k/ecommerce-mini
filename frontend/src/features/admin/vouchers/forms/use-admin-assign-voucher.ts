import {
  assignVoucherSchema,
  type AssignVoucherFormOutput,
  type AssignVoucherFormValues,
} from "../schema/admin-voucher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useAdminAssignVoucherForm = () => {
  return useForm<AssignVoucherFormValues, unknown, AssignVoucherFormOutput>({
    resolver: zodResolver(assignVoucherSchema),

    defaultValues: {
      userIds: [],
      usagePerUser: 1,
    },

    mode: "onSubmit",
  });
};
