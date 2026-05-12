import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "../schemas/create-category.schema";

export const useCreateCategoryForm = () => {
  return useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),

    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: undefined,
      isActive: true,
    },
  });
};
