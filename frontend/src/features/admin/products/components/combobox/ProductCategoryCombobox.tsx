"use client";

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
import { getCategoryDisplayName } from "@/utils/category/category-display-name";
import { useState } from "react";
import type { FlatCategoryItem } from "@features/admin/categories/types/admin-category.type";

type Props = {
  categories: FlatCategoryItem[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const ProductCategoryCombobox = ({
  categories,
  value,
  onChange,
  placeholder = "Chọn danh mục",
}: Props) => {
  const [open, setOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          {selectedCategory
            ? getCategoryDisplayName(selectedCategory.name)
            : placeholder}

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Tìm danh mục..." />

          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>

            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={getCategoryDisplayName(category.name)}
                  onSelect={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                >
                  {"—".repeat(category.level - 1)}
                  {getCategoryDisplayName(category.name)}

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
