import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createVoucherSchema,
  type CreateVoucherFormOutput,
  type CreateVoucherFormValues,
} from "../schema/admin-voucher";
import {
  VOUCHER_SCOPES,
  VOUCHER_TARGETS,
  VOUCHER_TYPES,
} from "@shared/types/voucher";

export const useAdminCreateVoucherForm = () => {
  return useForm<CreateVoucherFormValues, unknown, CreateVoucherFormOutput>({
    resolver: zodResolver(createVoucherSchema),

    defaultValues: {
      code: "",

      type: VOUCHER_TYPES.PERCENT,

      value: 1,

      maxDiscount: undefined,

      minOrderValue: undefined,

      usageLimit: 1,

      scope: VOUCHER_SCOPES.ORDER,
      target: VOUCHER_TARGETS.GLOBAL,

      isActive: true,

      startAt: "",

      endAt: "",

      productIds: [],

      categoryIds: [],
    },

    mode: "onSubmit",
  });
};
