import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateCategorySchema,
  type UpdateCategoryFormValues,
} from "../schemas/category.schema";
import { VARIANT_TYPES } from "../types/admin-category.type";

export const useUpdateCategoryForm = (
  initialData?: Partial<UpdateCategoryFormValues>,
) => {
  return useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),

    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      parentId: initialData?.parentId ?? undefined,
      isActive: initialData?.isActive ?? true,
      variantType: initialData?.variantType ?? VARIANT_TYPES.NONE,
      file: undefined,
    },
  });
};
