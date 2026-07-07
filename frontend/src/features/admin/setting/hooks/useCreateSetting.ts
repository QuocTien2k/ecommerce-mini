import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSettingPayload } from "../types/admin-setting.type";
import { adminSettingApi } from "../api/adminSetting.api";
import { SETTING_QUERY_KEY } from "@/domains/setting/constant/setting.constant";

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
        queryKey: SETTING_QUERY_KEY.all,
      });
    },
  });
};
