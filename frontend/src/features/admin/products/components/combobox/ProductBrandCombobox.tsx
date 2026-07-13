import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AdminBrandItem } from "@features/admin/brands/types/admin-brand.type";
import { useState } from "react";
import { SpinnerOverlay } from "@components/ui/spinner-overlay";

type ProductBrandComboboxProps = {
  brands: AdminBrandItem[];
  value?: string;
  onChange: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
};

export const ProductBrandCombobox = ({
  brands,
  value,
  onChange,
  loading = false,
  placeholder = "Chọn thương hiệu",
}: ProductBrandComboboxProps) => {
  const [open, setOpen] = useState(false);

  const selectedBrand = brands.find((brand) => brand.id === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          {selectedBrand?.name ?? placeholder}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Tìm thương hiệu..." />

          <CommandList>
            {loading ? (
              <SpinnerOverlay text="Đang tải thương hiệu" />
            ) : (
              <>
                <CommandEmpty>Không tìm thấy thương hiệu.</CommandEmpty>

                <CommandGroup>
                  {brands.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.name}
                      onSelect={() => {
                        onChange(brand.id);
                        setOpen(false);
                      }}
                    >
                      {brand.name}

                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === brand.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
