import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="flex h-10 min-w-16 items-center justify-center rounded-md border font-medium">
        {value}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
