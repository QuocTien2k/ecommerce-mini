import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PriceSortFilterProps {
  value: "" | "asc" | "desc";
  onChange: (value: "" | "asc" | "desc") => void;
}

export const PriceSortFilter = ({ value, onChange }: PriceSortFilterProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Giá tiền</h2>

      <RadioGroup
        value={value || "default"}
        onValueChange={(val) =>
          onChange(val === "default" ? "" : (val as "asc" | "desc"))
        }
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id="price-default" />
          <Label htmlFor="price-default">Mặc định</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="asc" id="price-asc" />
          <Label htmlFor="price-asc">Giá tăng dần</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="desc" id="price-desc" />
          <Label htmlFor="price-desc">Giá giảm dần</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
