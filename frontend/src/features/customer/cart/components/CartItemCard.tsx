import { Trash2 } from "lucide-react";
import type { CartItem } from "../types/customer-cart.type";
import { useDeleteCartItem } from "../hooks/useDeleteCart";
import { formatProductAttributes } from "@/utils/format-product-attributes";
import { formatCurrency } from "@lib/format-currency";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { QuantitySelector } from "@components/product/QuantitySelector";
import { useUpdateCartItem } from "../hooks/useUpdateCart";
import { cn } from "@lib/utils";

interface Props {
  item: CartItem;
  compact?: boolean;
}

export const CartItemCard = ({ item, compact = false }: Props) => {
  const { mutateAsync: deleteItem } = useDeleteCartItem();
  const { mutateAsync: updateItem } = useUpdateCartItem();
  const { loading: deleting, run: runDelete } = useScopedLoading();
  const { loading: updating, run: runUpdate } = useScopedLoading();

  const handleDelete = () => runDelete(() => deleteItem(item.id));

  const handleQuantityChange = (quantity: number) =>
    runUpdate(() =>
      updateItem({
        cartItemId: item.id,
        quantity,
      }),
    );

  //console.log("Item: ", item);

  return (
    <div
      className={cn(
        "flex gap-4",
        compact ? "py-3 border-b last:border-b-0" : "p-4 rounded-lg border",
      )}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.productName}
        className={cn(
          "rounded-md object-cover border shrink-0",
          compact ? "size-16" : "size-24",
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "font-medium leading-5",
            compact ? "text-sm line-clamp-2" : "text-base",
          )}
        >
          {item.productName}
        </div>

        {item.color && (
          <div className="mt-1 text-xs text-muted-foreground">
            Color: {item.color}
          </div>
        )}

        {item.attributes && (
          <div className="mt-1 text-xs text-muted-foreground">
            {formatProductAttributes(item.attributes)}
          </div>
        )}

        <div
          className={cn(
            "flex items-center justify-between",
            compact ? "pt-2" : "mt-4",
          )}
        >
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={item.stock}
            size="sm"
            disabled={updating}
          />

          <span
            className={cn("font-semibold", compact ? "text-sm" : "text-base")}
          >
            {formatCurrency(item.totalPrice)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <AsyncButton
        variant="ghost"
        size="icon-lg"
        loading={deleting}
        showLoadingText={false}
        onClick={handleDelete}
        className={cn(
          "shrink-0 text-red-500 hover:text-red-600",
          compact ? "size-8" : "size-10",
        )}
      >
        <Trash2 className="size-4" />
      </AsyncButton>
    </div>
  );
};
