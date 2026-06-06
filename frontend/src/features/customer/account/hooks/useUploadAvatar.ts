import { useAppDispatch } from "@app/hooks";
import { useMutation } from "@tanstack/react-query";
import { accountApi } from "../api/account.api";
import { updateAvatar } from "@features/admin/user/store/user.slice";

export const useUploadAvatarMutation = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (file: File) => accountApi.uploadAvatar(file),

    onSuccess: (response) => {
      dispatch(updateAvatar(response.data.avatar));
    },
  });
};
