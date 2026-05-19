import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "../schemas/category.schema";
import { VARIANT_TYPES } from "../types/admin-category.type";

export const useCreateCategoryForm = () => {
  return useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),

    defaultValues: {
      name: "",
      description: "",
      parentId: undefined,
      isActive: true,
      variantType: VARIANT_TYPES.NONE,
      file: undefined,
    },
  });
};
