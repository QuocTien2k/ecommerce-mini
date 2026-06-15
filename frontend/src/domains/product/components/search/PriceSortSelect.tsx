import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceSortSelectProps {
  value: "" | "asc" | "desc";
  onChange: (value: "" | "asc" | "desc") => void;
}

export const PriceSortSelect = ({ value, onChange }: PriceSortSelectProps) => {
  return (
    <Select
      value={value || "default"}
      onValueChange={(val) =>
        onChange(val === "default" ? "" : (val as "asc" | "desc"))
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Sắp xếp giá" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="default">Mặc định</SelectItem>

        <SelectItem value="asc">Giá tăng dần</SelectItem>

        <SelectItem value="desc">Giá giảm dần</SelectItem>
      </SelectContent>
    </Select>
  );
};
