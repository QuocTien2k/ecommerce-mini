import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminUpdateVariantPayload } from "../types/admin-variant.type";
import { adminProductVariantApi } from "../api/adminVariant.api";
import { ADMIN_PRODUCTS_QUERY_KEY } from "../constants/product.query-key";

type UpdateVariantFormValues = {
  id: string;
  productId: string;
  data: AdminUpdateVariantPayload;

  files?: File[];
};

export const useAdminUpdateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, files }: UpdateVariantFormValues) => {
      return await adminProductVariantApi.update(id, data, files || []);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-product-detail", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY],
      });
    },
  });
};
