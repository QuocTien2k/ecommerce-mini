import { api } from "@shared/api/axios";
import type { Rating, RatingPayload } from "../types/customerRating.type";
import type { ApiResult } from "@shared/types/api-result";

export const customerRatingApi = {
  getMyRating: (productId: string): ApiResult<Rating | null> =>
    api.get(`/rating/${productId}/me`),

  upsertRating: (payload: RatingPayload): ApiResult<Rating> =>
    api.post("/rating", payload),

  deleteRating: (productId: string): ApiResult<void> =>
    api.delete(`/rating/${productId}`),
};
