import { useProvince } from "@/hooks/address/useProvinces";
import AddressCombobox from "./AddressCombobox";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ProvinceSelect({ value, onChange, disabled }: Props) {
  const { data = [], isLoading } = useProvince();

  return (
    <AddressCombobox
      options={data}
      value={value}
      onChange={onChange}
      disabled={disabled || isLoading}
      placeholder="Chọn tỉnh / thành"
      searchPlaceholder="Tìm tỉnh / thành..."
    />
  );
}
