import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PaginatedResponse } from "@shared/types/pagination";
import type {
  AdminProductDetail,
  AdminProductListItem,
  AdminProductListQueryParams,
} from "../types/admin-product.type";

export const adminProductApi = {
  getList: (
    params?: AdminProductListQueryParams,
  ): ApiResult<PaginatedResponse<AdminProductListItem>> =>
    api.get("/admin/product/list", { params }),

  getDetail: (id: string): ApiResult<AdminProductDetail> =>
    api.get(`/admin/product/${id}`),
};
