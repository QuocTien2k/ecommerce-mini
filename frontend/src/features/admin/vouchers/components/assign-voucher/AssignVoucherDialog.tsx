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
import {
  VOUCHER_TARGETS,
  type AdminVoucher,
} from "../../types/admin-voucher.type";

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

  const isGlobal = voucher.target === VOUCHER_TARGETS.GLOBAL;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gửi voucher "{voucher.code}"</DialogTitle>

          <DialogDescription>
            {isGlobal
              ? "Voucher GLOBAL được áp dụng cho tất cả người dùng, không thể cấp phát thủ công."
              : "Chọn người dùng nhận voucher này."}
          </DialogDescription>
        </DialogHeader>

        {!isGlobal && (
          <FormProvider {...form}>
            <AssignVoucherForm
              voucherId={voucher.id}
              onSuccess={() => {
                form.reset();
                onOpenChange(false);
              }}
            />
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};
