import { cn } from "@lib/utils";
import type { PublicProductListItem } from "../types/public-product.type";
import { ProductCard } from "./ProductCard";

type Props = {
  products: PublicProductListItem[];
  className?: string;
};

export const ProductGrid = ({ products, className }: Props) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
