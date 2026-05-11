import { useQuery } from "@tanstack/react-query";

import { adminCategory } from "../api/adminCategory.api";

export const ADMIN_FLAT_CATEGORIES_QUERY_KEY = "admin-flat-categories";

export const useAdminFlatCategoriesQuery = () => {
  return useQuery({
    queryKey: [ADMIN_FLAT_CATEGORIES_QUERY_KEY],

    queryFn: () => adminCategory.getFlat(),

    staleTime: 1000 * 60 * 5,
  });
};
