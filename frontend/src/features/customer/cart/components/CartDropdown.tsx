import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { ShoppingCart } from "lucide-react";
import { useGetCart } from "../hooks/useGetCart";
import { CartDropdownItem } from "./CartDropdownItem";
import { formatCurrency } from "@lib/format-currency";

export const CartDropdown = () => {
  const { data: cartResponse } = useGetCart();

  const cart = cartResponse?.data;

  //console.log(cart);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="size-5" />

          {cart?.totalQuantity ? (
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5">
              {cart.totalQuantity}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={14} className="w-110 p-4">
        {!cart || cart.items.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6">
            Giỏ hàng trống
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-90 overflow-auto">
              {cart.items.map((item) => (
                <CartDropdownItem key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t mt-3 pt-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Tổng số lượng</span>
                <span>{cart.totalQuantity}</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Tổng tiền</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
