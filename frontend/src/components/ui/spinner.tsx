import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizeMap = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export const Spinner = ({ size = "md", label, className }: SpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        role="status"
        aria-label={label || "Loading"}
        className={cn(
          "animate-spin rounded-full border-gray-300 border-t-gray-700",
          sizeMap[size],
        )}
      />

      {label && <span className="text-xs text-gray-600">{label}</span>}
    </div>
  );
};
