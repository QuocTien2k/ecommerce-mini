import { buildFormData } from "@/utils/form-data";
import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { UploadAvatarResponse } from "../types/account.type";

export const accountApi = {
  uploadAvatar: (file: File): ApiResult<UploadAvatarResponse> => {
    return api.patch("/user/avatar", buildFormData({}, { file }));
  },
};
