import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RevenueYearSelectProps = {
  value: number;
  onValueChange: (year: number) => void;
};

export default function RevenueYearSelect({
  value,
  onValueChange,
}: RevenueYearSelectProps) {
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  return (
    <Select
      value={String(value)}
      onValueChange={(value) => onValueChange(Number(value))}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>

      <SelectContent position="popper">
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
