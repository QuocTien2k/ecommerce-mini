import { Button } from "@components/ui/button";
import type { OrderSummary } from "../../types/customerOrder.type";
import { Link } from "react-router-dom";
import { formatCurrency } from "@lib/format-currency";

interface Props {
  order: OrderSummary;
}

const OrderCard = ({ order }: Props) => {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">#{order.id.slice(0, 8)}</span>

        <span>{order.statusLabel}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <img
          src={order.thumbnail ?? "/placeholder-product.png"}
          alt="Order thumbnail"
          className="h-16 w-16 rounded-md object-cover"
        />

        <div>
          <p className="text-sm text-muted-foreground">
            {order.itemCount} sản phẩm
          </p>

          <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
        </div>
      </div>

      <div className="mt-2">
        <Button asChild>
          <Link to={`/order/${order.id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
