import { formatCurrency } from "@lib/format-currency";
import type { OrderDetail } from "../../types/customerOrder.type";
import { cn } from "@lib/utils";
import { ORDER_STATUS_COLORS } from "@shared/types/order-status";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const OrderHeader = ({ order }: { order: OrderDetail }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
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

      <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">Sản phẩm</p>

          <p className="font-medium">{order.items.length}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Tổng thanh toán</p>

          <p className="font-semibold">
            {formatCurrency(order.pricing.totalPrice)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Trạng thái</p>

          <p className="font-medium">{order.statusLabel}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
