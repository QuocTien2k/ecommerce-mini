import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import clsx from "clsx";

type ToolbarButtonProps = {
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
};

export function ToolbarButton({ active, icon, onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="icon"
      onClick={onClick}
      className={clsx("h-8 w-8", active && "border-primary")}
    >
      {icon}
    </Button>
  );
}
