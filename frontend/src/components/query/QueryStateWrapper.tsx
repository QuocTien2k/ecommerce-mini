import { Spinner } from "@components/ui/spinner";
import { SpinnerOverlay } from "@components/ui/spinner-overlay";
import type { ReactNode } from "react";

type Props = {
  isLoading: boolean;
  isFetching?: boolean;
  loadingText?: string;
  fullscreen?: boolean;
  skeleton?: ReactNode;
  children: ReactNode;
};

export function QueryStateWrapper({
  isLoading,
  isFetching,
  loadingText = "Đang tải dữ liệu...",
  fullscreen = false,
  children,
}: Props) {
  if (isLoading) {
    return (
      <div
        className={
          fullscreen
            ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            : "absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        }
      >
        <Spinner size="lg" label={loadingText} />
      </div>
    );
  }

  return (
    <div className="relative">
      {children}

      {isFetching && <SpinnerOverlay />}
    </div>
  );
}
