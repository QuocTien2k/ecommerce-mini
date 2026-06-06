import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PaginatedResponse } from "@shared/types/pagination";
import type {
  AdminCategoryDetail,
  AdminCategoryItem,
  AdminCategoryQueryParams,
  CreateCategoryDto,
  FlatCategoryItem,
} from "../types/admin-category.type";
import { buildFormData } from "@/utils/form-data";

export const adminCategory = {
  getList: (
    params?: AdminCategoryQueryParams,
  ): ApiResult<PaginatedResponse<AdminCategoryItem>> =>
    api.get("/admin/category/list", { params }),

  getFlat: (): ApiResult<FlatCategoryItem[]> => api.get("/admin/category/flat"),

  detail: (categoryId: string): ApiResult<AdminCategoryDetail> =>
    api.get(`/admin/category/${categoryId}`),

  create: (
    data: CreateCategoryDto,
    file?: File,
  ): ApiResult<AdminCategoryItem> => {
    return api.post(
      "/admin/category/create",
      buildFormData(data, file ? { file } : undefined),
    );
  },

  update: (
    id: string,
    data: Partial<CreateCategoryDto>,
    file?: File,
  ): ApiResult<AdminCategoryItem> => {
    //console.log("Update Payload: ", data);
    return api.patch(
      `/admin/category/${id}`,
      buildFormData(data, file ? { file } : undefined),
    );
  },

  softDelete: (categoryId: string): ApiResult<null> =>
    api.patch(`/admin/category/soft/${categoryId}`),

  restore: (categoryId: string): ApiResult<null> =>
    api.patch(`/admin/category/restore/${categoryId}`),
};
