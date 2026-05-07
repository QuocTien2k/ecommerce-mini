import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizeMap = {
  sm: {
    ring: "w-12 h-12 border-[3px]",
    text: "text-[10px]",
  },
  md: {
    ring: "w-20 h-20 border-4",
    text: "text-xs",
  },
  lg: {
    ring: "w-28 h-28 border-[5px]",
    text: "text-sm",
  },
};

export const Spinner = ({ size = "md", label, className }: SpinnerProps) => {
  const currentSize = sizeMap[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="relative flex items-center justify-center perspective-[800px]">
        <div
          className={cn(
            "absolute rounded-full border-transparent border-b-pink-400 animate-ring-1",
            currentSize.ring,
          )}
        />

        <div
          className={cn(
            "absolute rounded-full border-transparent border-b-rose-500 animate-ring-2",
            currentSize.ring,
          )}
        />

        <div
          className={cn(
            "absolute rounded-full border-transparent border-b-cyan-400 animate-ring-3",
            currentSize.ring,
          )}
        />

        <div
          className={cn(
            "absolute rounded-full border-transparent border-b-amber-400 animate-ring-4",
            currentSize.ring,
          )}
        />

        <div
          className={cn(
            "font-medium text-muted-foreground tracking-wide",
            currentSize.text,
          )}
        >
          {label || "Loading"}
        </div>
      </div>
    </div>
  );
};
