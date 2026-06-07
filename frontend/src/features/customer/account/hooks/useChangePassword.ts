import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordPayload } from "../types/account.type";
import { accountApi } from "../api/account.api";

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      accountApi.changePassword(payload),
  });
};
