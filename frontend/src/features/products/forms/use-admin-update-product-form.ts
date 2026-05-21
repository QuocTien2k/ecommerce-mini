import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProductSchema,
  type UpdateProductFormOutput,
  type UpdateProductFormValues,
} from "../schemas/product.schema";

export const useAdminUpdateProductForm = () => {
  return useForm<UpdateProductFormValues, unknown, UpdateProductFormOutput>({
    resolver: zodResolver(updateProductSchema),

    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,

      // undefined = giữ nguyên discount
      // null = xoá discount
      discountPct: undefined,

      isActive: true,
      categoryId: "",
    },

    mode: "onSubmit",
  });
};
