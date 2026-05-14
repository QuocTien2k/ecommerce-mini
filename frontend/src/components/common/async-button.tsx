import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

type AsyncButtonProps = ButtonProps & {
  loading?: boolean;
  loadingText?: string;
  showLoadingText?: boolean;
};

export const AsyncButton = ({
  loading,
  loadingText = "Đang xử lý",
  showLoadingText = true,
  disabled,
  children,
  ...props
}: AsyncButtonProps) => {
  const { className, ...restProps } = props;
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        loading && showLoadingText && "gap-2",
        className,
      )}
      {...restProps}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
          {showLoadingText && <span>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
