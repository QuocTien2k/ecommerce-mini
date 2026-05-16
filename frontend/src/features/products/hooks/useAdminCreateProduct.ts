import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminCreateProductPayload } from "../types/admin-product.type";
import type { AdminCreateVariantPayload } from "../types/admin-variant.type";
import { adminProductApi } from "../api/adminProduct.api";
import { adminProductVariantApi } from "../api/adminVariant.api";
import { ADMIN_PRODUCTS_QUERY_KEY } from "../constants/product.query-key";

type CreateProductFormValues = AdminCreateProductPayload;

export const useAdminCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductFormValues) => {
      return await adminProductApi.create(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY],
      });
    },
  });
};
