import { useQuery } from "@tanstack/react-query";
import { SETTING_QUERY_KEY } from "../constant/setting.constant";
import { publicSettingApi } from "../api/setting.api";

export const useGetSetting = () => {
  return useQuery({
    queryKey: SETTING_QUERY_KEY.all,
    queryFn: async () => {
      const res = await publicSettingApi.get();
      return res.data;
    },
  });
};
