import { Button } from "@components/ui/button";
import type { OrderSummary } from "../../types/customerOrder.type";
import { Link } from "react-router-dom";
import { formatCurrency } from "@lib/format-currency";
import { ORDER_STATUS_COLORS } from "@shared/types/order-status";

interface Props {
  order: OrderSummary;
}

const OrderCard = ({ order }: Props) => {
  return (
    <div className="flex h-full flex-col rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">#{order.id.slice(0, 8)}</span>

        <span
          className={`text-sm px-2 py-1 rounded ${ORDER_STATUS_COLORS[order.status]}`}
        >
          {order.statusLabel}
        </span>
      </div>

      <img
        src={order.thumbnail ?? "/placeholder-product.png"}
        alt="Order thumbnail"
        className="h-40 w-full rounded-md object-cover"
      />

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-sm text-slate-500">
          {order.itemCount} sản phẩm
        </span>

        <span className="font-semibold text-red-600">
          {formatCurrency(order.totalPrice)}
        </span>
      </div>

      <Button
        asChild
        className="mt-4 bg-slate-900 hover:bg-slate-800 text-white self-center"
      >
        <Link to={`/order/${order.id}`}>Xem chi tiết</Link>
      </Button>
    </div>
  );
};

export default OrderCard;
