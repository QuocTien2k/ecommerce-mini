import { Button } from "@components/ui/button";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

type AsyncButtonProps = ButtonProps & {
  loading?: boolean;
  loadingText?: string;
};

export const AsyncButton = ({
  loading,
  loadingText = "Đang xử lý",
  disabled,
  children,
  ...props
}: AsyncButtonProps) => {
  return (
    <Button
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2"
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      <span>{loading ? loadingText : children}</span>
    </Button>
  );
};
