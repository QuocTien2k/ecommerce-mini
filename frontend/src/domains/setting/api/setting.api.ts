import type { ApiResult } from "@shared/types/api-result";
import type { Setting } from "../types/setting.type";
import { api } from "@shared/api/axios";

export const publicSettingApi = {
  get: (): ApiResult<Setting> => api.get("/setting"),
};
