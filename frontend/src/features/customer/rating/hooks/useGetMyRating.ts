import { useQuery } from "@tanstack/react-query";
import { CUSTOMER_RATING_QUERY_KEY } from "../constant/rating-query-key.contants";
import { customerRatingApi } from "../api/customerRating.api";

export const useGetMyRating = (productId: string) => {
  return useQuery({
    queryKey: CUSTOMER_RATING_QUERY_KEY.mine(productId),
    queryFn: () => customerRatingApi.getMyRating(productId),
    select: (response) => response.data,
    enabled: !!productId,
  });
};
