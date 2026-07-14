import { publicProductApi } from "../api/publicProduct.api";
import { PUBLIC_PRODUCT_QUERY_KEY } from "../constants/product.constant";
import type { PublicProductListQueryParams } from "../types/public-product.type";
import { useQuery } from "@tanstack/react-query";

/*Case home */
export const usePublicHomeProductsQuery = () => {
  return useQuery({
    queryKey: PUBLIC_PRODUCT_QUERY_KEY.home(),

    queryFn: () => publicProductApi.getHomeData(),
  });
};

/*Case lists product */
export const usePublicProductsQuery = (
  params?: PublicProductListQueryParams,
) => {
  return useQuery({
    queryKey: PUBLIC_PRODUCT_QUERY_KEY.list(params),
    queryFn: async () => {
      return publicProductApi.getList(params);
    },

    placeholderData: (prev) => prev,
  });
};
