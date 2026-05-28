import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateVoucherSchema,
  type UpdateVoucherFormValues,
} from "../schema/admin-voucher";

export const useAdminUpdateVoucherForm = (
  initialValues?: Partial<UpdateVoucherFormValues>,
) => {
  return useForm<UpdateVoucherFormValues, unknown, UpdateVoucherFormValues>({
    resolver: zodResolver(updateVoucherSchema),

    defaultValues: {
      isActive: undefined,

      startAt: "",
      endAt: "",

      usageLimit: undefined,

      minOrderValue: undefined,

      ...initialValues,
    },

    mode: "onSubmit",
  });
};
