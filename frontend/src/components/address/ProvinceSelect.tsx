import { useProvince } from "@/hooks/address/useProvinces";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ProvinceSelect({ value, onChange, disabled }: Props) {
  const { data, isLoading } = useProvince();

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || isLoading}
    >
      <option value="">Chọn tỉnh / thành</option>

      {data?.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
}
