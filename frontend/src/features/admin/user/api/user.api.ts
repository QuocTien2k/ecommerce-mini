import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { AdminUser } from "../types/adminUser.type";

export const userApi = {
  getMe: (): ApiResult<AdminUser> => api.get("/user/me"),
};
