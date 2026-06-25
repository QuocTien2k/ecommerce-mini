import { Package } from "lucide-react";

const OrderEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Package className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">Chưa có đơn hàng nào</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Hệ thống hiện chưa ghi nhận đơn hàng nào.
      </p>
    </div>
  );
};

export default OrderEmpty;
