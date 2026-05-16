import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateVariantSchema,
  type UpdateVariantFormOutput,
  type UpdateVariantFormValues,
} from "../schemas/product.schema";
import { useForm } from "react-hook-form";

export const useUpdateVariantForm = () => {
  return useForm<UpdateVariantFormValues, unknown, UpdateVariantFormOutput>({
    resolver: zodResolver(updateVariantSchema),

    defaultValues: {
      color: "",
      stock: 0,
      attributes: {},
      files: [],
      removeImagePublicIds: [],
    },

    mode: "onSubmit",
  });
};
