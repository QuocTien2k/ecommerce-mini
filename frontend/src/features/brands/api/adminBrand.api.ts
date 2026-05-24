import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PaginatedResponse } from "@shared/types/pagination";
import type {
  AdminBrandItem,
  AdminBrandQueryParams,
  CreateBrandPayload,
  CreateBrandResponse,
  UpdateBrandPayload,
  UpdateBrandResponse,
} from "../types/admin-brand.type";

export const adminBrand = {
  getList: (
    params?: AdminBrandQueryParams,
  ): ApiResult<PaginatedResponse<AdminBrandItem>> =>
    api.get("/brands/list", { params }),

  create: (payload: CreateBrandPayload): ApiResult<CreateBrandResponse> =>
    api.post("/brands/create", payload),

  update: (
    id: string,
    payload: UpdateBrandPayload,
  ): ApiResult<UpdateBrandResponse> => api.patch(`/brands/${id}`, payload),
};
