import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { useAdminOrderDetail } from "../hooks/useAdminOrderDetail";

interface AdminOrderUpdateProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
}

const AdminUpdateOrder = ({
  open,
  orderId,
  onClose,
}: AdminOrderUpdateProps) => {
  const { data: order, isLoading } = useAdminOrderDetail(orderId);

  if (!open || !orderId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cập nhật đơn hàng</h2>

          <Button variant="destructive" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Info */}
      </div>
    </div>
  );
};

export default AdminUpdateOrder;
