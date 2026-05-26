import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductApi } from "../api/adminProduct.api";
import { ADMIN_PRODUCTS_QUERY_KEY } from "../constants/product.query-key";

export const useAdminStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      action,
    }: {
      productId: string;
      action: "delete" | "restore";
    }) => {
      if (action === "delete") {
        return adminProductApi.softDelete(productId);
      }

      return adminProductApi.restore(productId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY],
      });
    },
  });
};
