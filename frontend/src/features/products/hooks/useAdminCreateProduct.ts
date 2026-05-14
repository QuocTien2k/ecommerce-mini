import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminCreateProductPayload } from "../types/admin-product.type";
import type { AdminCreateVariantPayload } from "../types/admin-variant.type";
import { adminProductApi } from "../api/adminProduct.api";
import { adminProductVariantApi } from "../api/adminVariant.api";
import { ADMIN_PRODUCTS_QUERY_KEY } from "../constants/product.query-key";

type CreateProductFormValues = {
  product: AdminCreateProductPayload;

  variant: Omit<AdminCreateVariantPayload, "productId">;

  files: File[];
};

export const useAdminCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      product,
      variant,
      files,
    }: CreateProductFormValues) => {
      //create product
      const createdProduct = await adminProductApi.create(product);

      //create first variant
      const createdVariant = await adminProductVariantApi.create(
        {
          ...variant,
          productId: createdProduct.data.id,
        },
        files,
      );

      return {
        product: createdProduct,
        variant: createdVariant,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY],
      });
    },
  });
};
