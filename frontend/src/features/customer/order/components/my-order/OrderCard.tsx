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

      <div className="mt-3 text-sm text-muted-foreground">
        {order.itemCount} sản phẩm
      </div>

      <div className="mt-3 text-right font-semibold">
        {formatCurrency(order.totalPrice)}
      </div>

      <Button asChild>
        <Link to={`/order/${order.id}`}>Xem chi tiết</Link>
      </Button>
    </div>
  );
};

export default OrderCard;
