import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PaginatedResponse } from "@shared/types/pagination";
import type {
  AdminCategoryItem,
  AdminCategoryQueryParams,
  FlatCategoryItem,
} from "../types/admin-category.type";

export const adminCategory = {
  getList: (
    params?: AdminCategoryQueryParams,
  ): ApiResult<PaginatedResponse<AdminCategoryItem>> =>
    api.get("/admin/category/list", { params }),

  getFlat: (): ApiResult<FlatCategoryItem[]> => api.get("/admin/category/flat"),
};
