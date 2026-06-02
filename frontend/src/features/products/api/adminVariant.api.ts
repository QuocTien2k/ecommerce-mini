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
    const formData = buildFormData(data, { files: files || [] });

    appendArrayField(
      formData,
      "removeImagePublicIds",
      data.removeImagePublicIds,
    );
    appendArrayField(formData, "imageUrls", data.imageUrls); // optional future-safe

    return api.patch(`/admin/product-variant/${id}`, formData);
  },
};
