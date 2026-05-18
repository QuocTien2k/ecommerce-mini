import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProductVariantSchema,
  type UpdateProductVariantFormOutput,
  type UpdateProductVariantFormValues,
} from "../schemas/product-variant.schema";
import type { AdminVariantResponse } from "../types/admin-variant.type";
import { useForm } from "react-hook-form";

export const useAdminUpdateVariantForm = (variant: AdminVariantResponse) => {
  return useForm<
    UpdateProductVariantFormValues,
    unknown,
    UpdateProductVariantFormOutput
  >({
    resolver: zodResolver(updateProductVariantSchema),

    defaultValues: {
      color: variant.color,

      attributes: variant.attributes || {},

      stock: variant.stock,

      files: [],

      removeImagePublicIds: [],
    },

    mode: "onSubmit",
  });
};
