import { useQuery } from "@tanstack/react-query";
import { getWardsByProvince } from "@/services/address.service";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useWards = (province?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WARDS, province],
    queryFn: () => getWardsByProvince(province as string),
    enabled: !!province,
  });
};
