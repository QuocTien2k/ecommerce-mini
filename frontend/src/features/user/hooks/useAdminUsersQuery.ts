import { useQuery } from "@tanstack/react-query";
import { adminUserApi, type GetUsersParams } from "../api/adminUser.api";
import type { GetUsersData } from "../types/adminUser.type";

export const ADMIN_USERS_QUERY_KEY = "admin-users";

export const useAdminUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: [ADMIN_USERS_QUERY_KEY, params],
    queryFn: async (): Promise<GetUsersData> => {
      const res = await adminUserApi.getUsers(params);
      return res;
    },
    placeholderData: (prev) => prev,
  });
};
