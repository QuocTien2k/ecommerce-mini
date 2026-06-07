import { useMemo } from "react";
import { useCommunes } from "./useCommunes";
import { useProvince } from "./useProvinces";

/**
 * Case 1:
 * Dùng cho flow tạo/cập nhật địa chỉ từ form.
 * Form lưu provinceCode và wardCode, hook sẽ resolve sang tên
 * để build chuỗi address gửi lên BE.
 */
type AddressResolverParams = {
  provinceCode?: string;
  wardCode?: string;
};

export function useAddressResolver(params: AddressResolverParams) {
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

/**
 * Case 2:
 * Dùng cho màn Update Profile.
 * BE trả về address dạng string (detail, wardName, provinceName),
 * hook sẽ resolve ngược từ tên sang code để prefill dữ liệu vào form.
 */
type AddressCodeResolverParams = {
  provinceName?: string;
  wardName?: string;
};

export function useAddressCodeResolver(params: AddressCodeResolverParams) {
  const { data: provinces = [] } = useProvince();

  const provinceCode = useMemo(() => {
    return provinces.find((p) => p.label === params.provinceName)?.value;
  }, [params.provinceName, provinces]);

  const { data: communes = [] } = useCommunes(provinceCode);

  const wardCode = useMemo(() => {
    return communes.find((w) => w.label === params.wardName)?.value;
  }, [params.wardName, communes]);

  return {
    provinceCode: provinceCode ?? "",
    wardCode: wardCode ?? "",
  };
}
