import { useQuery } from "@tanstack/react-query";
import { adminCategory } from "../api/adminCategory.api";

export const ADMIN_CATEGORY_DETAIL_QUERY_KEY = "admin-category-detail";

export const useAdminCategoryDetailQuery = (categoryId?: string) => {
  return useQuery({
    queryKey: [ADMIN_CATEGORY_DETAIL_QUERY_KEY, categoryId],

    queryFn: () => adminCategory.detail(categoryId!),

    enabled: Boolean(categoryId),
  });
};
