import { useQuery } from "@tanstack/react-query";
import type { GetWishlistQuery } from "../types/customerWishlist.type";
import { customerWishlistApi } from "../api/customerWishlist.api";

export const CUSTOMER_WISHLIST_QUERY_KEY = "customer-wishlist";

/* Case get */
export const useCustomerWishlistQuery = (params?: GetWishlistQuery) => {
  return useQuery({
    queryKey: [CUSTOMER_WISHLIST_QUERY_KEY, params],

    queryFn: () => customerWishlistApi.getWishlist(params),

    placeholderData: (prev) => prev,
  });
};
