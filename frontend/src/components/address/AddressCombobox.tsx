import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { normalizeVietnamese } from "@/utils/normalizeVietnamese";

import { cn } from "@/lib/utils";

import { Button } from "@components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";

type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  disabled?: boolean;
};

const AddressCombobox = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((item) => item.value === value);

  const filteredOptions = useMemo(() => {
    const keyword = normalizeVietnamese(search);

    if (!keyword) return options;

    return options.filter((item) =>
      normalizeVietnamese(item.label).includes(keyword),
    );
  }, [options, search]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
    }
  };

  const selectOption = (value: string) => {
    onChange(value);
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-11 w-full justify-between border-zinc-300 bg-white font-normal hover:bg-zinc-100"
        >
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>

          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) border-zinc-200 bg-white p-0 shadow-md"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandEmpty>Không tìm thấy dữ liệu.</CommandEmpty>

            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  className="cursor-pointer hover:bg-slate-200"
                  key={option.value}
                  value={option.label}
                  onSelect={() => selectOption(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />

                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddressCombobox;
