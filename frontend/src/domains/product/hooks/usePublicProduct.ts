import { publicProductApi } from "../api/publicProduct.api";
import type { PublicProductListQueryParams } from "../types/public-product.type";
import { useQuery } from "@tanstack/react-query";

export const PUBLIC_PRODUCTS_QUERY_KEY = "public-products";

export const usePublicProductsQuery = (
  params?: PublicProductListQueryParams,
) => {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return useQuery({
    queryKey: [PUBLIC_PRODUCTS_QUERY_KEY, params],

    queryFn: async () => {
      await sleep(2000);
      return publicProductApi.getList(params);
    },

    placeholderData: (prev) => prev,
  });
};
