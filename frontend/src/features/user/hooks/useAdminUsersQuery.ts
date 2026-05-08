import { useQuery } from "@tanstack/react-query";
import { adminUserApi } from "../api/adminUser.api";
import type { GetUsersParams } from "../types/adminUser.type";

export const ADMIN_USERS_QUERY_KEY = "admin-users";

export const useAdminUsersQuery = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: [ADMIN_USERS_QUERY_KEY, params],

    queryFn: () => adminUserApi.getUsers(params),

    placeholderData: (prev) => prev,
  });
};
