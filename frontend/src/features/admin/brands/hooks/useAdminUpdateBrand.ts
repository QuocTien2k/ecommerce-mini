import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateBrandPayload } from "../types/admin-brand.type";
import { adminBrand } from "../api/adminBrand.api";
import { ADMIN_BRAND_QUERY_KEY } from "./useAdminBrandQuery";

interface UpdateBrandMutationParams {
  id: string;
  payload: UpdateBrandPayload;
}

export const useAdminUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateBrandMutationParams) =>
      adminBrand.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_BRAND_QUERY_KEY],
      });
    },
  });
};
