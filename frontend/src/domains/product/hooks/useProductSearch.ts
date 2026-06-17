import { useQuery } from "@tanstack/react-query";
import { publicProductApi } from "../api/publicProduct.api";

export const PRODUCT_SEARCH_PREVIEW_QUERY_KEY = "product-search-preview";

export const useProductSearchPreviewQuery = (keyword: string) => {
  //console.log("Preview Query:", keyword);
  return useQuery({
    queryKey: [PRODUCT_SEARCH_PREVIEW_QUERY_KEY, keyword],

    queryFn: async () =>
      publicProductApi.getList({
        search: keyword,
        page: 1,
        limit: 5,
      }),

    enabled: keyword.trim().length >= 2,
  });
};
