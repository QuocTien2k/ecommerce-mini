import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerRatingApi } from "../api/customerRating.api";
import { CUSTOMER_RATING_QUERY_KEY } from "../constant/rating-query-key.contants";

export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      customerRatingApi.deleteRating(productId),

    onSuccess: (_, productId) => {
      queryClient.setQueryData(CUSTOMER_RATING_QUERY_KEY.mine(productId), null);
    },
  });
};
