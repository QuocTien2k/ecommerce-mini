import { buildFormData } from "@/utils/form-data";
import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type {
  CreateSettingPayload,
  CreateSettingResponse,
} from "../types/admin-setting.type";

export const adminSettingApi = {
  create: (
    data: CreateSettingPayload,
    file?: File,
  ): ApiResult<CreateSettingResponse> => {
    const formData = buildFormData(data, file ? { file } : undefined);

    return api.post("/settings", formData);
  },
};
