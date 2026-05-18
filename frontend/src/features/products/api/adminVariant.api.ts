import type { ApiResult } from "@shared/types/api-result";
import type {
  AdminCreateVariantPayload,
  AdminCreateVariantResponse,
  AdminUpdateVariantPayload,
  AdminUpdateVariantResponse,
} from "../types/admin-variant.type";
import { api } from "@shared/api/axios";
import { buildFormData } from "@/utils/form-data";

export const adminProductVariantApi = {
  create: (
    data: AdminCreateVariantPayload,
    files: File[],
  ): ApiResult<AdminCreateVariantResponse> => {
    return api.post(
      "/admin/product-variant/create",
      buildFormData(data, { files }),
    );
  },
  update: (
    id: string,
    data: AdminUpdateVariantPayload,
    files?: File[],
  ): ApiResult<AdminUpdateVariantResponse> => {
    return api.patch(
      `/admin/product-variant/${id}`,
      buildFormData(data, { files: files || [] }),
    );
  },
};
