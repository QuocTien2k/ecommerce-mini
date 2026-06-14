import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PaginatedResponse } from "@shared/types/pagination";
import type { PublicBrandItem } from "../types/public-brand.type";

export const publicBrandApi = {
  getList: (): ApiResult<PaginatedResponse<PublicBrandItem>> =>
    api.get("/brands?limit=12"),
};
