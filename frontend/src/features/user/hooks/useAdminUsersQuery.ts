import { useQuery } from "@tanstack/react-query";
import { adminUserApi, type GetUsersParams } from "../api/adminUser.api";
import type { AdminUser } from "../types/adminUser.type";
import type { ApiResponse } from "@shared/types/api-response";
import type { PaginatedResponse } from "@shared/types/pagination";

export const ADMIN_USERS_QUERY_KEY = "admin-users";

export const useAdminUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: [ADMIN_USERS_QUERY_KEY, params],
    queryFn: async (): Promise<ApiResponse<PaginatedResponse<AdminUser>>> => {
      await new Promise((r) => setTimeout(r, 1000));
      const res = await adminUserApi.getUsers(params);
      return res;
    },
    placeholderData: (prev) => prev,
  });
};
