import { useMemo } from "react";
import { useCommunes } from "./useCommunes";
import { useProvince } from "./useProvinces";

type Params = {
  provinceCode?: string;
  wardCode?: string;
};

export function useAddressResolver(params: Params) {
  const { data: provinces = [] } = useProvince();
  const { data: communes = [] } = useCommunes(params.provinceCode);

  const provinceName = useMemo(() => {
    if (!params.provinceCode) return undefined;

    return provinces.find((p) => p.value === params.provinceCode)?.label;
  }, [params.provinceCode, provinces]);

  const wardName = useMemo(() => {
    if (!params.wardCode) return undefined;

    return communes.find((w) => w.value === params.wardCode)?.label;
  }, [params.wardCode, communes]);

  return {
    provinceName,
    wardName,
  };
}
