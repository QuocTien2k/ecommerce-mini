import type { Setting } from "@/domains/setting/types/setting.type";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import AdminSettingForm from "./AdminSettingForm";

type AdminSettingDialogProps = {
  open: boolean;
  mode: "create" | "update";
  onClose: () => void;
  setting?: Setting;
};

const AdminSettingDialog = ({
  open,
  mode,
  onClose,
  setting,
}: AdminSettingDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {mode === "create"
              ? "Tạo cài đặt website"
              : "Cập nhật cài đặt website"}
          </h2>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <AdminSettingForm
          mode={mode}
          setting={setting}
          onSuccess={handleClose}
        />
      </div>
    </div>
  );
};

export default AdminSettingDialog;
