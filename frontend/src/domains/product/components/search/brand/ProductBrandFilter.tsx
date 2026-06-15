import { usePublicBrandsQuery } from "@/domains/brand/hooks/usePublicBrand";
import { cn } from "@lib/utils";
import { ProductBrandRadioItem } from "./ProductBrandRadioItem";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";

interface ProductBrandFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProductBrandFilter = ({
  value,
  onChange,
}: ProductBrandFilterProps) => {
  const { data } = usePublicBrandsQuery();

  const brands = data?.data ?? [];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Thương hiệu</h2>

      <RadioGroup
        value={value || "all"}
        onValueChange={(val) => onChange(val === "all" ? "" : val)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="brand-all" />
          <Label htmlFor="brand-all">Tất cả thương hiệu</Label>
        </div>

        <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto">
          {brands.map((brand) => (
            <ProductBrandRadioItem key={brand.id} brand={brand} />
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
