import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBrand } from "../api/adminBrand.api";
import type { CreateBrandPayload } from "../types/admin-brand.type";
import { ADMIN_BRAND_QUERY_KEY } from "./useAdminBrandQuery";

export const useAdminCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBrandPayload) => adminBrand.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_BRAND_QUERY_KEY],
      });
    },
  });
};
