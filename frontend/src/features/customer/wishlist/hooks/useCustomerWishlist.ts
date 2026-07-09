import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetWishlistQuery } from "../types/customerWishlist.type";
import { customerWishlistApi } from "../api/customerWishlist.api";
import {
  PUBLIC_HOME_PRODUCTS_QUERY_KEY,
  PUBLIC_PRODUCTS_QUERY_KEY,
} from "@/domains/product/hooks/usePublicProduct";

export const CUSTOMER_WISHLIST_QUERY_KEY = "customer-wishlist";

/* Case get */
export const useCustomerWishlistQuery = (params?: GetWishlistQuery) => {
  return useQuery({
    queryKey: [CUSTOMER_WISHLIST_QUERY_KEY, params],

    queryFn: () => customerWishlistApi.getWishlist(params),

    placeholderData: (prev) => prev,
  });
};

/* Case toggle */
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      customerWishlistApi.toggleWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CUSTOMER_WISHLIST_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [PUBLIC_HOME_PRODUCTS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [PUBLIC_PRODUCTS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: ["public-product-detail"],
      });
    },
  });
};
