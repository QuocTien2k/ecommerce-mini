import type { PublicBrandItem } from "@/domains/brand/types/public-brand.type";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@components/ui/radio-group";

interface ProductBrandRadioItemProps {
  brand: PublicBrandItem;
}

export const ProductBrandRadioItem = ({
  brand,
}: ProductBrandRadioItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={brand.id} id={`brand-${brand.id}`} />

      <Label
        htmlFor={`brand-${brand.id}`}
        className="cursor-pointer truncate text-sm font-normal"
      >
        {brand.name}
      </Label>
    </div>
  );
};
