import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TopProductsDaySelectProps = {
  value: number;
  onValueChange: (value: number) => void;
};

const options = [
  {
    value: 7,
    label: "7 ngày",
  },
  {
    value: 30,
    label: "30 ngày",
  },
  {
    value: 90,
    label: "90 ngày",
  },
  {
    value: 365,
    label: "365 ngày",
  },
];

export default function TopProductsDaySelect({
  value,
  onValueChange,
}: TopProductsDaySelectProps) {
  return (
    <Select
      value={String(value)}
      onValueChange={(value) => onValueChange(Number(value))}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>

      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
