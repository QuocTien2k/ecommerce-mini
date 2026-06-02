import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createProductVariantSchema,
  type CreateProductVariantFormOutput,
  type CreateProductVariantFormValues,
} from "../schemas/product-variant.schema";

export const useAdminCreateVariantForm = () => {
  return useForm<
    CreateProductVariantFormValues,
    unknown,
    CreateProductVariantFormOutput
  >({
    resolver: zodResolver(createProductVariantSchema),

    defaultValues: {
      color: "",
      attributes: {},
      stock: 0,
      files: [],
      imageUrls: [],
    },

    mode: "onSubmit",
  });
};
