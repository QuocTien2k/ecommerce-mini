import { useState } from "react";
import { Controller, type Path, type UseFormReturn } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FASHION_SIZE_TYPES,
  type FashionSizeType,
} from "@/features/admin/products/types/product-variant-ui.type";

type VariantFormValues = {
  attributes?: Record<string, string | number>;
};

type VariantFieldProps<T extends VariantFormValues> = {
  form: UseFormReturn<T>;
};

const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"];

const SHOE_SIZES = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43"];

const SizeColor = <T extends VariantFormValues>({
  form,
}: VariantFieldProps<T>) => {
  const [sizeType, setSizeType] = useState<FashionSizeType>("CLOTHING");

  const sizes =
    sizeType === FASHION_SIZE_TYPES.CLOTHING ? CLOTHING_SIZES : SHOE_SIZES;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Size Type */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Loại size</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSizeType(FASHION_SIZE_TYPES.CLOTHING)}
            className={`rounded-md cursor-pointer border px-3 py-2 text-sm transition ${
              sizeType === FASHION_SIZE_TYPES.CLOTHING
                ? "border-black bg-black text-white"
                : "border-gray-300"
            }`}
          >
            Quần áo
          </button>

          <button
            type="button"
            onClick={() => setSizeType(FASHION_SIZE_TYPES.SHOE)}
            className={`rounded-md border cursor-pointer px-3 py-2 text-sm transition ${
              sizeType === FASHION_SIZE_TYPES.SHOE
                ? "border-black bg-black text-white"
                : "border-gray-300"
            }`}
          >
            Giày
          </button>
        </div>
      </div>

      {/* Size */}
      <Controller
        control={form.control}
        name={"attributes.size" as Path<T>}
        render={({ field }) => (
          <div className="space-y-2">
            <p className="text-sm font-medium">Size</p>

            <Select
              value={field.value?.toString() || ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn size" />
              </SelectTrigger>

              <SelectContent position="popper">
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />
    </div>
  );
};

export default SizeColor;
