import type { CartItem } from "@features/customer/cart/types/customer-cart.type";

interface OrderItemsPreviewProps {
  items: CartItem[];
}

const OrderItemsPreview = ({ items }: OrderItemsPreviewProps) => {
  return (
    <div className="border rounded-md p-4 space-y-3">
      <h2 className="font-medium">Sản phẩm</h2>

      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <div>
            {item.productName} × {item.quantity}
          </div>
          <div>{item.totalPrice.toLocaleString()}₫</div>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsPreview;
