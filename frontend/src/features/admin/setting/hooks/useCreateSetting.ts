import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSettingPayload } from "../types/admin-setting.type";
import { adminSettingApi } from "../api/adminSetting.api";
import { ADMIN_SETTING_QUERY_KEY } from "../constant/admin-setting.constant";

type AdminCreateSettingMutationPayload = {
  data: CreateSettingPayload;
  file?: File;
};

export const useAdminCreateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: AdminCreateSettingMutationPayload) =>
      adminSettingApi.create(data, file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_SETTING_QUERY_KEY],
      });
    },
  });
};
