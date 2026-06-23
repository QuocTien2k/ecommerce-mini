import { formatProductAttributes } from "@/utils/format-product-attributes";
import type { OrderItemDetail } from "../../types/customerOrder.type";

const OrderItems = ({ items }: { items: OrderItemDetail[] }) => {
  return (
    <div>
      <h3>Items</h3>

      {items.map((item) => (
        <div key={item.id} style={{ borderBottom: "1px solid #eee" }}>
          <div>{item.productName}</div>

          <div>Qty: {item.quantity}</div>
          <div>Price: {item.price}</div>

          {item.selectedAttributes && (
            <div>
              <span>{formatProductAttributes(item.selectedAttributes)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
