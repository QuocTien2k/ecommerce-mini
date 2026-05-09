import { useQuery } from "@tanstack/react-query";
import { getProvinces } from "@/services/address.service";
import { QUERY_KEYS } from "@/constants/queryKeys";

interface UseProvincesProps {
  search?: string;
}

export const useProvinces = ({ search }: UseProvincesProps = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROVINCES, search],
    queryFn: () =>
      getProvinces({
        search,
        limit: 20,
      }),
  });
};
