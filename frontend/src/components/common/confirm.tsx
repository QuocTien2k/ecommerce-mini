"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  destructive?: boolean;

  icon?: ReactNode;

  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  open,
  title = "Xác nhận thao tác",
  description = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",

  loading = false,
  destructive = false,

  icon,

  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full",
              destructive
                ? "bg-red-500/10 text-red-500"
                : "bg-primary/10 text-primary",
            )}
          >
            {icon ?? <AlertTriangle className="size-5" />}
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="text-base font-semibold">{title}</h2>

            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>

          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
