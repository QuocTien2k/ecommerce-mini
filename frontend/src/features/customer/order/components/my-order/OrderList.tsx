import type { OrderSummary } from "../../types/customerOrder.type";
import OrderCard from "./OrderCard";

interface Props {
  orders: OrderSummary[];
}

const OrderList = ({ orders }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
