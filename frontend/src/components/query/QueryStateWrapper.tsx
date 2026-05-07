import { Spinner } from "@components/ui/spinner";
import { SpinnerOverlay } from "@components/ui/spinner-overlay";
import type { ReactNode } from "react";

type Props = {
  isLoading: boolean;
  isFetching?: boolean;
  skeleton?: ReactNode;
  children: ReactNode;
};

export function QueryStateWrapper({ isLoading, isFetching, children }: Props) {
  if (isLoading) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Spinner size="lg" label="Đang tải dữ liệu..." />
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
