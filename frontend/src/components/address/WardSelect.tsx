import { useWards } from "@/hooks/address/useWard";

interface Props {
  province?: string;
  value?: string;
  onChange: (value: string) => void;
}

export const WardSelect = ({ province, value, onChange }: Props) => {
  const { data, isLoading } = useWards(province);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={!province}
    >
      <option value="">Select ward</option>

      {data?.map((ward) => (
        <option key={ward.name} value={ward.name}>
          {ward.name}
        </option>
      ))}
    </select>
  );
};
