import { publicProductApi } from "../api/publicProduct.api";
import type { PublicProductListQueryParams } from "../types/public-product.type";
import { useQuery } from "@tanstack/react-query";

/*Case home */
export const PUBLIC_HOME_PRODUCTS_QUERY_KEY = "public-home-products";
export const usePublicHomeProductsQuery = () => {
  return useQuery({
    queryKey: [PUBLIC_HOME_PRODUCTS_QUERY_KEY],

    queryFn: () => publicProductApi.getHomeData(),
  });
};

/*Case lists product */
export const PUBLIC_PRODUCTS_QUERY_KEY = "public-products";
export const usePublicProductsQuery = (
  params?: PublicProductListQueryParams,
) => {
  return useQuery({
    queryKey: [
      PUBLIC_PRODUCTS_QUERY_KEY,
      {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
        categoryId: params?.categoryId,
        brandId: params?.brandId,
        priceSort: params?.priceSort ?? "",
      },
    ],
    queryFn: async () => {
      return publicProductApi.getList(params);
    },

    placeholderData: (prev) => prev,
  });
};
