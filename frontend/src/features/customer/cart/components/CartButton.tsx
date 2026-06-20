import { Button } from "@components/ui/button";
import { useGetCart } from "../hooks/useGetCart";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export const CartButton = () => {
  const { data: cartResponse } = useGetCart();

  const cart = cartResponse?.data;

  return (
    <Button asChild variant="ghost" size="icon">
      <Link to="/cart" className="relative">
        <ShoppingCart className="size-5" />

        {cart?.totalQuantity ? (
          <span className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {cart.totalQuantity}
          </span>
        ) : null}
      </Link>
    </Button>
  );
};
