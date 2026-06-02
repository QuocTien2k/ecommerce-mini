import type { ApiResult } from "@shared/types/api-result";
import type {
  AdminCreateVariantPayload,
  AdminCreateVariantResponse,
  AdminUpdateVariantPayload,
  AdminUpdateVariantResponse,
} from "../types/admin-variant.type";
import { api } from "@shared/api/axios";
import { appendArrayField, buildFormData } from "@/utils/form-data";

export const adminProductVariantApi = {
  create: (
    data: AdminCreateVariantPayload,
    files: File[],
  ): ApiResult<AdminCreateVariantResponse> => {
    const formData = buildFormData(data, { files });

    appendArrayField(formData, "imageUrls", data.imageUrls);

    return api.post("/admin/product-variant/create", formData);
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
