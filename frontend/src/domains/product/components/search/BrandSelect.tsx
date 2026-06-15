import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublicBrandsQuery } from "@/domains/brand/hooks/usePublicBrand";

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const BrandSelect = ({ value, onChange }: BrandSelectProps) => {
  const { data } = usePublicBrandsQuery();
  const brands = data?.data ?? [];

  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val === "all" ? "" : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Thương hiệu" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">Tất cả thương hiệu</SelectItem>

        {brands.map((brand) => (
          <SelectItem key={brand.id} value={brand.id}>
            {brand.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
