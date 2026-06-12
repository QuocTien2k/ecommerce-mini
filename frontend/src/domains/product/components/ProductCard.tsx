import { Link } from "react-router-dom";
import type { PublicProductListItem } from "../types/public-product.type";
import { formatCurrency } from "@lib/format-currency";

type Props = {
  product: PublicProductListItem;
};

export function ProductCard({ product }: Props) {
  const { slug, name, thumbnail, price, discountPrice, discountPct } = product;

  const hasDiscount =
    Number(discountPrice) > 0 && Number(discountPrice) < Number(price);

  return (
    <Link
      to={`/products/${slug}`}
      className="group block overflow-hidden rounded-xl border bg-background transition-all hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {discountPct != null && discountPct > 0 && (
          <div className=" absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{discountPct}%
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium">{name}</h3>

        <div>
          {hasDiscount ? (
            <>
              <div className="font-semibold text-red-600">
                {formatCurrency(discountPrice)}
              </div>

              <div className="text-xs text-muted-foreground line-through">
                {formatCurrency(price)}
              </div>
            </>
          ) : (
            <div className="font-semibold">{formatCurrency(price)}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
