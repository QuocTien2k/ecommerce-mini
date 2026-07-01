import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateRatingPayload } from "../types/customerRating.type";
import { customerRatingApi } from "../api/customerRating.api";
import { CUSTOMER_RATING_QUERY_KEY } from "../constant/rating-query-key.contants";

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRatingPayload) =>
      customerRatingApi.createRating(payload),

    onSuccess: (response) => {
      const rating = response.data;

      queryClient.setQueryData(
        CUSTOMER_RATING_QUERY_KEY.mine(rating.productId),
        rating,
      );
    },
  });
};
