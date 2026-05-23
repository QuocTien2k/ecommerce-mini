import { useQuery } from "@tanstack/react-query";
import type { AdminBrandQueryParams } from "../types/admin-brand.type";
import { adminBrand } from "../api/adminBrand.api";

export const ADMIN_BRAND_QUERY_KEY = "ADMIN_BRAND_QUERY_KEY";

export const useAdminBrandQuery = (params?: AdminBrandQueryParams) => {
  return useQuery({
    queryKey: [ADMIN_BRAND_QUERY_KEY, params],
    queryFn: () => adminBrand.getList(params),
    placeholderData: (prev) => prev,
  });
};
