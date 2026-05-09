import { fetchProvinces } from "@/services/address.service";
import { mapOptions } from "@/utils/address.mapper";
import { useQuery } from "@tanstack/react-query";

export function useProvince() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    select: mapOptions,
    staleTime: 1000 * 60 * 60, // 1h cache
  });
}
