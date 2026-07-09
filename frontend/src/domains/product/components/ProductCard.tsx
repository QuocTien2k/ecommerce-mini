import { Link } from "react-router-dom";
import type { ProductCardItem } from "../types/public-product.type";
import { formatCurrency } from "@lib/format-currency";
import { Star } from "lucide-react";
import { WishlistButton } from "@features/customer/wishlist/components/WishlistButton";

type Props = {
  product: ProductCardItem;
};

export function ProductCard({ product }: Props) {
  const {
    slug,
    name,
    thumbnail,
    price,
    discountPrice,
    discountPct,
    ratingAvg,
    ratingCount,
  } = product;

  const hasDiscount =
    Number(discountPrice) > 0 && Number(discountPrice) < Number(price);

  return (
    <Link
      to={`/products/${slug}`}
      className="group block overflow-hidden rounded-xl border bg-background transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="relative h-40 sm:h-44 lg:h-52 p-3 lg:p-4 items-center justify-center overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="mx-auto size-32 object-contain transition-transform duration-300 group-hover:scale-105 sm:size-36 lg:size-45"
        />

        <WishlistButton
          productId={product.id}
          isWishlisted={product.isWishlisted}
          className="absolute right-2 top-2 z-10 bg-background/90 shadow"
        />

        {discountPct != null && discountPct > 0 && (
          <div className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:px-2 sm:py-1 sm:text-xs">
            -{discountPct}%
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 h-10 text-xs sm:text-sm font-medium">
          {name}
        </h3>

        {ratingCount > 0 && (
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />

            <span className="font-medium">{Number(ratingAvg).toFixed(1)}</span>

            <span className="text-muted-foreground">({ratingCount})</span>
          </div>
        )}

        {hasDiscount ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-semibold text-red-600">
              {formatCurrency(discountPrice)}
            </span>

            <span className="text-[11px] line-through text-slate-400 sm:text-xs">
              {formatCurrency(price)}
            </span>
          </div>
        ) : (
          <div className="text-sm font-semibold sm:text-base">
            {formatCurrency(price)}
          </div>
        )}
      </div>
    </Link>
  );
}
