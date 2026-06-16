import { useQuery } from "@tanstack/react-query";
import { publicProductApi } from "../api/publicProduct.api";

export const usePublicProductDetail = (slug: string) => {
  return useQuery({
    queryKey: ["public-product-detail", slug],

    queryFn: async () => {
      const response = await publicProductApi.getDetail(slug);

      return response.data;
    },

    enabled: !!slug,
  });
};
