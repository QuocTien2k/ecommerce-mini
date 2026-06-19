import { Trash2 } from "lucide-react";
import type { CartItem } from "../types/customer-cart.type";
import { useDeleteCartItem } from "../hooks/useDeleteCart";
import { formatProductAttributes } from "@/utils/format-product-attributes";
import { formatCurrency } from "@lib/format-currency";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { QuantitySelector } from "@components/product/QuantitySelector";
import { useUpdateCartItem } from "../hooks/useUpdateCart";

interface Props {
  item: CartItem;
}

export const CartDropdownItem = ({ item }: Props) => {
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

  console.log("Item: ", item);

  return (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
      {/* image */}
      <img
        src={item.image}
        className="size-16 rounded-md object-cover border"
      />

      {/* info */}
      <div className="flex-1 space-y-2">
        <div className="font-medium text-sm line-clamp-2 leading-5">
          {item.productName}
        </div>

        {item.color && (
          <div className="text-xs text-muted-foreground">
            Color: {item.color}
          </div>
        )}

        {item.attributes && (
          <div className="text-muted-foreground line-clamp-1">
            {formatProductAttributes(item.attributes)}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={item.stock}
            size="sm"
            disabled={updating}
          />

          <span className="font-semibold text-sm">
            {formatCurrency(item.totalPrice)}
          </span>
        </div>
      </div>

      {/* actions */}
      <AsyncButton
        variant="ghost"
        size="icon-lg"
        loading={deleting}
        showLoadingText={false}
        onClick={handleDelete}
        className="size-8 shrink-0 text-red-500 hover:text-red-600"
      >
        <Trash2 className="size-4" />
      </AsyncButton>
    </div>
  );
};
