import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateSettingPayload } from "../types/admin-setting.type";
import { adminSettingApi } from "../api/adminSetting.api";
import { SETTING_QUERY_KEY } from "@/domains/setting/constant/setting.constant";

type AdminUpdateSettingMutationPayload = {
  data: UpdateSettingPayload;
  file?: File;
};

export const useAdminUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: AdminUpdateSettingMutationPayload) =>
      adminSettingApi.update(data, file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTING_QUERY_KEY.all,
      });
    },
  });
};
