import { FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssignVoucherForm } from "./AssignVoucherForm";
import { useAdminAssignVoucherForm } from "../../forms/use-admin-assign-voucher";
import type { AdminVoucher } from "../../types/admin-voucher.type";

type AssignVoucherDialogProps = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  voucher: AdminVoucher | null;
};

export const AssignVoucherDialog = ({
  open,
  voucher,
  onOpenChange,
}: AssignVoucherDialogProps) => {
  const form = useAdminAssignVoucherForm();

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);

    if (!value) {
      form.reset();
    }
  };

  if (!voucher) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gửi voucher "{voucher.code}"</DialogTitle>

          <DialogDescription>
            Chọn người dùng nhận voucher này.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <AssignVoucherForm
            voucherId={voucher.id}
            onSuccess={() => {
              form.reset();
              onOpenChange(false);
            }}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
