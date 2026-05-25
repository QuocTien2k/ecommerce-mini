import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBrand } from "../api/adminBrand.api";
import { ADMIN_BRAND_QUERY_KEY } from "./useAdminBrandQuery";

type BrandActionType = "softDelete" | "restore";

export const useAdminBrandAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: BrandActionType }) => {
      if (action === "softDelete") {
        return adminBrand.softDelete(id);
      }

      return adminBrand.restore(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_BRAND_QUERY_KEY],
      });
    },
  });
};
