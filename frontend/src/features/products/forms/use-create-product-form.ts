import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductFormOutput,
  type CreateProductFormValues,
} from "../schemas/product.schema";

export const useCreateProductForm = () => {
  return useForm<CreateProductFormValues, unknown, CreateProductFormOutput>({
    resolver: zodResolver(createProductSchema),

    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      discountPct: 0,
      isActive: true,
      categoryId: "",
      color: "",
      stock: 0,
      attributes: {},
      files: [],
    },

    mode: "onSubmit",
  });
};
