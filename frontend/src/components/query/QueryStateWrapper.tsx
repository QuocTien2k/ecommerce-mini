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
      <div className="flex items-center justify-center h-64">
        <Spinner size="md" label="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="relative">
      {children}

      {isFetching && <SpinnerOverlay text="Đang cập nhật..." />}
    </div>
  );
}
