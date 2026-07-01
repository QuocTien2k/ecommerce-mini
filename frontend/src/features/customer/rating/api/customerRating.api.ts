import { api } from "@shared/api/axios";
import type {
  CreateRatingPayload,
  Rating,
  UpdateRatingPayload,
} from "../types/customerRating.type";
import type { ApiResult } from "@shared/types/api-result";

export const customerRatingApi = {
  getMyRating: (productId: string): ApiResult<Rating | null> =>
    api.get(`/rating/${productId}/me`),

  createRating: (payload: CreateRatingPayload): ApiResult<Rating> =>
    api.post("/rating", payload),

  updateRating: (
    productId: string,
    payload: UpdateRatingPayload,
  ): ApiResult<Rating> => api.patch(`/rating/${productId}`, payload),
};
