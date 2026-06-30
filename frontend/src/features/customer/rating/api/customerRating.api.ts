import { api } from "@shared/api/axios";
import type { CreateRatingPayload, Rating } from "../types/customerRating.type";
import type { ApiResult } from "@shared/types/api-result";

export const customerRatingApi = {
  createRating: (payload: CreateRatingPayload): ApiResult<Rating> =>
    api.post("/rating", payload),
};
