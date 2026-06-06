import { useQuery } from "@tanstack/react-query";
import type { AdminProductListQueryParams } from "../types/admin-product.type";
import { ADMIN_PRODUCTS_QUERY_KEY } from "../constants/product.query-key";
import { adminProductApi } from "../api/adminProduct.api";

export const useAdminProductsQuery = (params?: AdminProductListQueryParams) => {
  return useQuery({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, params],

    queryFn: () => adminProductApi.getList(params),

    placeholderData: (prev) => prev,
  });
};
