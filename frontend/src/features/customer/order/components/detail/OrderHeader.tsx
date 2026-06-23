import { formatCurrency } from "@lib/format-currency";
import type { OrderDetail } from "../../types/customerOrder.type";
import { cn } from "@lib/utils";
import { ORDER_STATUS_COLORS } from "@shared/types/order-status";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const OrderHeader = ({ order }: { order: OrderDetail }) => {
  return (
    <div className="p-6 space-y-6 border-b">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Đơn hàng #{order.id}</h2>

          <p className="text-sm text-muted-foreground">
            Đặt lúc{" "}
            {format(new Date(order.createdAt), "HH:mm dd/MM/yyyy", {
              locale: vi,
            })}
          </p>
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            ORDER_STATUS_COLORS[order.status],
          )}
        >
          {order.statusLabel}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-evenly gap-8 border-t pt-4 text-sm">
        <div>
          <span className="text-muted-foreground">Sản phẩm:</span>{" "}
          <span className="font-medium">{order.items.length}</span>
        </div>

        <div>
          <span className="text-muted-foreground">Tổng thanh toán:</span>{" "}
          <span className="font-semibold">
            {formatCurrency(order.pricing.totalPrice)}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">Trạng thái:</span>{" "}
          <span className="font-medium">{order.statusLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
