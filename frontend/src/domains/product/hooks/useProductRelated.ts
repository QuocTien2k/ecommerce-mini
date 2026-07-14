import { useQuery } from "@tanstack/react-query";
import { PUBLIC_PRODUCT_QUERY_KEY } from "../constants/product.constant";
import { publicProductApi } from "../api/publicProduct.api";

export const usePublicRelatedProducts = (slug: string) => {
  return useQuery({
    queryKey: PUBLIC_PRODUCT_QUERY_KEY.related(slug),

    queryFn: async () => {
      const response = await publicProductApi.getRelated(slug);
      return response.data;
    },

    enabled: !!slug,
  });
};
