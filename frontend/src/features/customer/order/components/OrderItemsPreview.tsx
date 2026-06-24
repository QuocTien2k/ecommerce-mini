import { formatProductAttributes } from "@/utils/format-product-attributes";
import { Button } from "@components/ui/button";
import type { CartItem } from "@features/customer/cart/types/customer-cart.type";
import { formatCurrency } from "@lib/format-currency";
import { useState } from "react";

interface OrderItemsPreviewProps {
  items: CartItem[];
}

const DEFAULT_VISIBLE_ITEMS = 2;

const OrderItemsPreview = ({ items }: OrderItemsPreviewProps) => {
  const [expanded, setExpanded] = useState(false);

  const hiddenCount = Math.max(0, items.length - DEFAULT_VISIBLE_ITEMS);

  const visibleItems = expanded ? items : items.slice(0, DEFAULT_VISIBLE_ITEMS);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-medium">Sản phẩm ({items.length})</h2>
      </div>

      <div className="divide-y">
        {visibleItems.map((item) => (
          <div key={item.id} className="flex gap-3 p-4">
            <img
              src={item.image}
              alt={item.productName}
              className="h-16 w-16 shrink-0 rounded-md border object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium">
                {item.productName}
              </p>

              {item.attributes && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatProductAttributes(item.attributes)}
                </p>
              )}

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {item.quantity} × {item.price.toLocaleString()}₫
                </span>

                <span className="text-sm font-medium">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="border-t px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Thu gọn" : `Xem thêm ${hiddenCount} sản phẩm`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderItemsPreview;
