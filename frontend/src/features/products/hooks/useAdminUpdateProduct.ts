import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminUpdateVariantPayload } from "../types/admin-variant.type";
import { adminProductVariantApi } from "../api/adminVariant.api";
import { ADMIN_PRODUCTS_QUERY_KEY } from "../constants/product.query-key";
import type { AdminUpdateProductPayload } from "../types/admin-product.type";
import { adminProductApi } from "../api/adminProduct.api";

type UpdateVariantFormValues = {
  id: string;
  productId: string;
  data: AdminUpdateVariantPayload;

  files?: File[];
};

type UpdateProductFormValues = {
  id: string;
  data: AdminUpdateProductPayload;
};

export const useAdminUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateProductFormValues) => {
      return await adminProductApi.update(id, data);
    },

    onSuccess: (_, variables) => {
      // invalidate detail
      queryClient.invalidateQueries({
        queryKey: ["admin-product-detail", variables.id],
      });

      // invalidate list
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY],
      });
    },
  });
};

//update chi tiết
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
