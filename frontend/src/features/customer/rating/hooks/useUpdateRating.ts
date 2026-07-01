import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateRatingPayload } from "../types/customerRating.type";
import { customerRatingApi } from "../api/customerRating.api";
import { CUSTOMER_RATING_QUERY_KEY } from "../constant/rating-query-key.contants";

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: UpdateRatingPayload;
    }) => customerRatingApi.updateRating(productId, payload),

    onSuccess: (response) => {
      const updatedRating = response.data;

      queryClient.setQueryData(
        CUSTOMER_RATING_QUERY_KEY.mine(updatedRating.productId),
        updatedRating,
      );
    },
  });
};
