import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VOUCHER_SCOPES, VOUCHER_TYPES } from "../types/admin-voucher.type";
import {
  createVoucherSchema,
  type CreateVoucherFormOutput,
  type CreateVoucherFormValues,
} from "../schema/admin-voucher";

export const useAdminCreateVoucherForm = () => {
  return useForm<CreateVoucherFormValues, unknown, CreateVoucherFormOutput>({
    resolver: zodResolver(createVoucherSchema),

    defaultValues: {
      code: "",

      type: VOUCHER_TYPES.PERCENT,

      value: 0,

      maxDiscount: undefined,

      minOrderValue: undefined,

      usageLimit: undefined,

      scope: VOUCHER_SCOPES.ORDER,

      isActive: true,

      startAt: undefined,

      endAt: undefined,

      productIds: [],

      categoryIds: [],
    },

    mode: "onSubmit",
  });
};
