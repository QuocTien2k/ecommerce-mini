import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateCategorySchema,
  type UpdateCategoryFormValues,
} from "../schemas/update-category.schema";
import { useForm } from "react-hook-form";

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
      file: undefined,
    },
  });
};
