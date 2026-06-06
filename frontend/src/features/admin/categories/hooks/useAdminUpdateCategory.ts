import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategory } from "../api/adminCategory.api";
import { ADMIN_CATEGORIES_QUERY_KEY } from "./useAdminCategoryQuery";
import { ADMIN_FLAT_CATEGORIES_QUERY_KEY } from "./useAdminCategoryFlatQuery";
import type { UpdateCategoryDto } from "../types/admin-category.type";

type UpdateCategoryPayload = {
  id: string;
  data: UpdateCategoryDto;
  file?: File;
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, file }: UpdateCategoryPayload) =>
      adminCategory.update(id, data, file),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ADMIN_CATEGORIES_QUERY_KEY],
        }),

        queryClient.invalidateQueries({
          queryKey: [ADMIN_FLAT_CATEGORIES_QUERY_KEY],
        }),
      ]);
    },
  });
};
