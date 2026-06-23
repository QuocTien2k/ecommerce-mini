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
              {Object.entries(item.selectedAttributes).map(([k, v]) => (
                <span key={k}>
                  {k}: {v}{" "}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
