import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCategoryDto } from "../types/admin-category.type";
import { adminCategory } from "../api/adminCategory.api";
import { ADMIN_CATEGORIES_QUERY_KEY } from "./useAdminCategoryQuery";

type CreateCategoryPayload = {
  data: CreateCategoryDto;
  file?: File;
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: CreateCategoryPayload) =>
      adminCategory.create(data, file),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ADMIN_CATEGORIES_QUERY_KEY],
      });
    },
  });
};
