import { Trash2 } from "lucide-react";
import type { CartItem } from "../types/customer-cart.type";
import { useDeleteCartItem } from "../hooks/useDeleteCart";

interface Props {
  item: CartItem;
}

export const CartDropdownItem = ({ item }: Props) => {
  const { mutate: deleteItem } = useDeleteCartItem();

  return (
    <div className="flex gap-3">
      {/* image */}
      <img
        src={item.image}
        className="w-12 h-12 rounded-md object-cover border"
      />

      {/* info */}
      <div className="flex-1 text-xs space-y-1">
        <div className="font-medium line-clamp-1">{item.productName}</div>

        {item.color && (
          <div className="text-muted-foreground">Color: {item.color}</div>
        )}

        {item.attributes && (
          <div className="text-muted-foreground line-clamp-1">
            {Object.entries(item.attributes)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")}
          </div>
        )}

        <div className="flex justify-between">
          <span>
            {item.quantity} × {item.price.toLocaleString()}₫
          </span>

          <span className="font-medium">
            {item.totalPrice.toLocaleString()}₫
          </span>
        </div>
      </div>

      {/* actions */}
      <button
        onClick={() => deleteItem(item.id)}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
