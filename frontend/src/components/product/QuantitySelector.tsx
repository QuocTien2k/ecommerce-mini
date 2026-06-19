import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  disabled,
}: QuantitySelectorProps) {
  const buttonSize = size === "sm" ? "icon-sm" : "icon";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => value > min && onChange(value - 1)}
        disabled={disabled || value <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div
        className={cn(
          "flex items-center justify-center rounded-md border font-medium",
          size === "sm" ? "h-8 min-w-10 text-sm" : "h-10 min-w-16 text-base",
        )}
      >
        {value}
      </div>

      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => value < max && onChange(value + 1)}
        disabled={disabled || value >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
