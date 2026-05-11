import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategory } from "../api/adminCategory.api";
import { ADMIN_CATEGORIES_QUERY_KEY } from "./useAdminCategoryQuery";

export const useSoftDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => adminCategory.softDelete(categoryId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ADMIN_CATEGORIES_QUERY_KEY],
      });
    },
  });
};

export const useRestoreCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => adminCategory.restore(categoryId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ADMIN_CATEGORIES_QUERY_KEY],
      });
    },
  });
};
