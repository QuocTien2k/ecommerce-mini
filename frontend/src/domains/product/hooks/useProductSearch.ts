import { useQuery } from "@tanstack/react-query";
import { publicProductApi } from "../api/publicProduct.api";
import { PUBLIC_PRODUCT_QUERY_KEY } from "../constants/product.constant";

export const useProductSearchPreviewQuery = (
  keyword: string,
  enabled = true,
) => {
  //console.log("Preview Query:", keyword);
  return useQuery({
    queryKey: PUBLIC_PRODUCT_QUERY_KEY.searchPreview(keyword),

    queryFn: async () =>
      publicProductApi.getList({
        search: keyword,
        page: 1,
        limit: 5,
      }),

    enabled: enabled && keyword.trim().length >= 2,
  });
};
