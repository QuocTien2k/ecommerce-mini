import { formatCurrency } from "@lib/format-currency";
import { formatDate } from "@lib/format-date";
import { cn } from "@lib/utils";
import { ORDER_STATUS_COLORS } from "@shared/types/order-status.utils";
import type { OrderDetail } from "@shared/types/order.type";
import { PAYMENT_LABEL, PAYMENT_STATUS_LABEL } from "@shared/types/payment";

const OrderHeader = ({ order }: { order: OrderDetail }) => {
  const payment = order.payment;

  //console.log(order);
  return (
    <div className="p-4 sm:p-6 space-y-6 border-b">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">
            Đơn hàng #{order.id}
          </h2>
          <p className="text-sm text-muted-foreground">
            Đặt lúc: {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={cn(
            "w-fit shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium",
            ORDER_STATUS_COLORS[order.status],
          )}
        >
          {order.statusLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Thanh toán:</span>
        <span className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
          {PAYMENT_LABEL[payment.method]}
        </span>

        <span className="rounded bg-muted px-2 py-1 text-xs">
          {PAYMENT_STATUS_LABEL[payment.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="text-xs text-muted-foreground">Sản phẩm</div>

          <div className="text-xl font-semibold">{order.items.length}</div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="text-xs text-muted-foreground">Tổng thanh toán</div>

          <div className="text-lg font-bold sm:text-xl wrap-break-words">
            {formatCurrency(order.pricing.totalPrice)}
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="text-xs text-muted-foreground">Trạng thái</div>

          <div className="font-semibold">{order.statusLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
