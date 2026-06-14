import { useQuery } from "@tanstack/react-query";
import { publicBrandApi } from "../api/publicBrand.api";

export const PUBLIC_BRANDS_QUERY_KEY = "public-brands";

export const usePublicBrandsQuery = () => {
  return useQuery({
    queryKey: [PUBLIC_BRANDS_QUERY_KEY],

    queryFn: async () => {
      const res = await publicBrandApi.getList();
      return res.data;
    },

    placeholderData: (prev) => prev,
  });
};
