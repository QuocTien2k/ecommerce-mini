import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "../api/adminUser.api";
import { ADMIN_USERS_QUERY_KEY } from "./useAdminUsersQuery";

export const useUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: string;
      isActive: boolean;
    }) => {
      if (isActive) {
        return adminUserApi.unlockUser(userId);
      }
      return adminUserApi.lockUser(userId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_USERS_QUERY_KEY],
      });
    },
  });
};
