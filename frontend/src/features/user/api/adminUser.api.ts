import { api } from "@shared/api/axios";
import type { AdminUser, GetUsersParams } from "../types/adminUser.type";
import type { ApiResult } from "@shared/types/api-result";

export const adminUserApi = {
  getUsers: (params?: GetUsersParams): ApiResult<AdminUser> =>
    api.get("/admin/users", { params }),

  lockUser: (userId: string): ApiResult<null> =>
    api.patch(`/admin/users/${userId}/lock`),

  unlockUser: (userId: string): ApiResult<null> =>
    api.patch(`/admin/users/${userId}/unlock`),
};
