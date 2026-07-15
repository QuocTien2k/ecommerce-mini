import { ShoppingCart } from "lucide-react";
import { useGetCart } from "./hooks/useGetCart";
import { EmptyState } from "@components/cart/EmptyState";
import { CartSummary } from "./components/CartSummary";
import { CartItemCard } from "./components/CartItemCard";

export const CartPage = () => {
  const { data: cartResponse } = useGetCart();

  const cart = cartResponse?.data;
  const availableVouchers = cart?.availableVouchers ?? [];

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-10">
        <EmptyState
          icon={<ShoppingCart className="size-8" />}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng"
        />
      </div>
    );
  }

  //console.log(availableVouchers);

  return (
    <div className="container max-w-full py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>

        <p className="text-muted-foreground text-sm mt-1">
          {cart.totalQuantity} sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Items */}
        <div className="rounded-lg border p-4 min-w-0 overflow-hidden">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <CartSummary
          totalQuantity={cart.totalQuantity}
          totalPrice={cart.totalPrice}
          availableVouchers={availableVouchers}
        />
      </div>
    </div>
  );
};
