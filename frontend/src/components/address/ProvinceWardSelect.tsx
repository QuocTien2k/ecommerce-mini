import { useVietnamProvince } from "@/hooks/useVietnamProvince";
import { Button } from "@components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils";
import { Check, ChevronsUpDown, Command } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  province: string;
  ward: string;

  onProvinceChange: (value: string) => void;
  onWardChange: (value: string) => void;
}

export const ProvinceWardSelect = ({
  province,
  ward,

  onProvinceChange,
  onWardChange,
}: Props) => {
  const { loading, provinceOptions, getWardsByProvince } = useVietnamProvince();

  const [provinceOpen, setProvinceOpen] = useState(false);

  const [wardOpen, setWardOpen] = useState(false);

  const wards = getWardsByProvince(province);

  useEffect(() => {
    onWardChange("");
  }, [province]);

  if (loading) {
    return <div>Loading address data...</div>;
  }

  return (
    <div className="grid gap-4">
      {/* Province */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Province / City</label>

        <Popover open={provinceOpen} onOpenChange={setProvinceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between"
            >
              {province || "Select province"}

              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search province..." />

              <CommandList>
                <CommandEmpty>No province found.</CommandEmpty>

                <CommandGroup>
                  {provinceOptions.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        onProvinceChange(currentValue);

                        setProvinceOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          province === item.value ? "opacity-100" : "opacity-0",
                        )}
                      />

                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Ward */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Ward / Commune</label>

          <Popover open={wardOpen} onOpenChange={setWardOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={!province}
                className="justify-between"
              >
                {ward || "Select ward"}

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search ward..." />

                <CommandList>
                  <CommandEmpty>No ward found.</CommandEmpty>

                  <CommandGroup>
                    {wards.map((item) => (
                      <CommandItem
                        key={item.name}
                        value={item.name}
                        onSelect={(currentValue) => {
                          onWardChange(currentValue);

                          setWardOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            ward === item.name ? "opacity-100" : "opacity-0",
                          )}
                        />

                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
