import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PaginatedResponse } from "@shared/types/pagination";
import type {
  AdminCreateProductPayload,
  AdminCreateProductResponse,
  AdminProductDetail,
  AdminProductListItem,
  AdminProductListQueryParams,
  AdminUpdateProductPayload,
  AdminUpdateProductResponse,
} from "../types/admin-product.type";

export const adminProductApi = {
  getList: (
    params?: AdminProductListQueryParams,
  ): ApiResult<PaginatedResponse<AdminProductListItem>> =>
    api.get("/admin/product/list", { params }),

  getDetail: (id: string): ApiResult<AdminProductDetail> =>
    api.get(`/admin/product/${id}`),

  create: (
    dto: AdminCreateProductPayload,
  ): ApiResult<AdminCreateProductResponse> =>
    api.post("/admin/product/create", dto),

  update: (
    id: string,
    dto: AdminUpdateProductPayload,
  ): ApiResult<AdminUpdateProductResponse> =>
    api.patch(`/admin/product/${id}`, dto),
};
