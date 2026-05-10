import { useCommunes } from "@/hooks/address/useCommunes";
import AddressCombobox from "./AddressCombobox";

type Props = {
  provinceCode?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function CommuneSelect({
  provinceCode,
  value,
  onChange,
  disabled,
}: Props) {
  const { data = [], isLoading } = useCommunes(provinceCode);

  return (
    <AddressCombobox
      options={data}
      value={value}
      onChange={onChange}
      disabled={!provinceCode || disabled || isLoading}
      placeholder={
        provinceCode ? "Chọn phường / xã" : "Vui lòng chọn tỉnh / thành trước"
      }
      searchPlaceholder="Tìm phường / xã..."
    />
  );
}
