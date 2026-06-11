import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type {
  PublicProductListQueryParams,
  PublicProductListResponse,
} from "../types/public-product.type";

export const publicProductApi = {
  getList: (
    params?: PublicProductListQueryParams,
  ): ApiResult<PublicProductListResponse> => api.get("/products", { params }),
};
