import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type {
  PublicHomeProductsResponse,
  PublicProductListQueryParams,
  PublicProductListResponse,
} from "../types/public-product.type";

export const publicProductApi = {
  getHomeData: (): ApiResult<PublicHomeProductsResponse> => api.get("/home"),

  getList: (
    params?: PublicProductListQueryParams,
  ): ApiResult<PublicProductListResponse> => api.get("/products", { params }),
};
