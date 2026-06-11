import { publicCategoryApi } from "../api/publicCategory.api";
import { useQuery } from "@tanstack/react-query";

export const PUBLIC_CATEGORIES_QUERY_KEY = "public-categories";

export const usePublicCategoriesQuery = () => {
  return useQuery({
    queryKey: [PUBLIC_CATEGORIES_QUERY_KEY],

    queryFn: async () => {
      const res = await publicCategoryApi.getTree();
      return res.data;
    },

    placeholderData: (prev) => prev,
  });
};
