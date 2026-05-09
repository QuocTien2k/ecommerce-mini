import { useCommunes } from "@/hooks/address/useCommunes";

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
  const { data, isLoading } = useCommunes(provinceCode);

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={!provinceCode || disabled || isLoading}
    >
      <option value="">Chọn phường / xã</option>

      {data?.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
