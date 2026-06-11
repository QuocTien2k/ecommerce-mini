import { publicProductApi } from "../api/publicProduct.api";
import type { PublicProductListQueryParams } from "../types/public-product.type";
import { useQuery } from "@tanstack/react-query";

export const PUBLIC_PRODUCTS_QUERY_KEY = "public-products";

export const usePublicProductsQuery = (
  params?: PublicProductListQueryParams,
) => {
  return useQuery({
    queryKey: [PUBLIC_PRODUCTS_QUERY_KEY, params],

    queryFn: () => publicProductApi.getList(params),

    placeholderData: (prev) => prev,
  });
};
