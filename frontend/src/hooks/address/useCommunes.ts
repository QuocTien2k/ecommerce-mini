import { useQuery } from "@tanstack/react-query";
import { fetchCommunes } from "@/services/address.service";
import { mapOptions } from "@/utils/address.mapper";

export function useCommunes(provinceCode?: string) {
  return useQuery({
    queryKey: ["communes", provinceCode],
    queryFn: () => fetchCommunes(provinceCode!),
    enabled: !!provinceCode,
    select: mapOptions,
    staleTime: 1000 * 60 * 60,
  });
}
