import { useQuery } from "@tanstack/react-query";
import { adminUserApi, type GetUsersParams } from "../api/adminUser.api";
import type { GetUsersData } from "../types/adminUser.type";
import type { ApiResponse } from "@shared/types/api-response";

export const ADMIN_USERS_QUERY_KEY = "admin-users";

export const useAdminUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: [ADMIN_USERS_QUERY_KEY, params],
    queryFn: async (): Promise<ApiResponse<GetUsersData>> => {
      await new Promise((r) => setTimeout(r, 1000));
      const res = await adminUserApi.getUsers(params);
      return res;
    },
    placeholderData: (prev) => prev,
  });
};
