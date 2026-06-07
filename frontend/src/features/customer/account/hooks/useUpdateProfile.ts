import { useAppDispatch } from "@app/hooks";
import { accountApi } from "../api/account.api";
import type { UpdateProfilePayload } from "../types/account.type";
import { updateProfile } from "@features/admin/user/store/user.slice";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfileMutation = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      accountApi.updateProfile(payload),

    onSuccess: (response) => {
      dispatch(updateProfile(response.data));
    },
  });
};
