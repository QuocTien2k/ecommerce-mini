import { useQuery } from "@tanstack/react-query";
import type { AdminCategoryQueryParams } from "../types/admin-category.type";
import { adminCategory } from "../api/adminCategory.api";

export const ADMIN_CATEGORIES_QUERY_KEY = "admin-categories";

export const useAdminCategoriesQuery = (params?: AdminCategoryQueryParams) => {
  return useQuery({
    queryKey: [ADMIN_CATEGORIES_QUERY_KEY, params],

    queryFn: () => adminCategory.getList(params),

    placeholderData: (prev) => prev,
  });
};
