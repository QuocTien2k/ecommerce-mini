import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RatingFilterProps {
  value?: number;
  onChange: (value?: number) => void;
}

const ratingOptions = [
  { value: "default", label: "Mặc định", stars: 0 },
  { value: "5", label: "Từ 5 sao", stars: 5 },
  { value: "4", label: "Từ 4 sao", stars: 4 },
  { value: "3", label: "Từ 3 sao", stars: 3 },
  { value: "2", label: "Từ 2 sao", stars: 2 },
  { value: "1", label: "Từ 1 sao", stars: 1 },
] as const;

export const RatingFilter = ({ value, onChange }: RatingFilterProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Đánh giá</h2>

      <RadioGroup
        value={value?.toString() ?? "default"}
        onValueChange={(val) =>
          onChange(val === "default" ? undefined : Number(val))
        }
        className="space-y-3"
      >
        {ratingOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`rating-${option.value}`}
            />

            <Label
              htmlFor={`rating-${option.value}`}
              className="flex cursor-pointer items-center gap-2"
            >
              {option.stars === 0 ? (
                <span>{option.label}</span>
              ) : (
                <>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < option.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span>{option.label}</span>
                </>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
