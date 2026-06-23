import type { OrderDetail } from "../../types/customerOrder.type";

const OrderHeader = ({ order }: { order: OrderDetail }) => {
  return (
    <div>
      <h2>Order #{order.id}</h2>

      <div>
        Status: <strong>{order.statusLabel}</strong>
      </div>

      <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
    </div>
  );
};

export default OrderHeader;
