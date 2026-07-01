import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerRatingApi } from "../api/customerRating.api";
import { CUSTOMER_RATING_QUERY_KEY } from "../constant/rating-query-key.contants";
import type { RatingPayload } from "../types/customerRating.type";

export const useUpsertRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RatingPayload) =>
      customerRatingApi.upsertRating(payload),

    onSuccess: (response) => {
      const rating = response.data;

      queryClient.setQueryData(
        CUSTOMER_RATING_QUERY_KEY.mine(rating.productId),
        rating,
      );
    },
  });
};
