import type { PublicProductListItem } from "../types/public-product.type";
import { ProductCard } from "./ProductCard";

type Props = {
  products: PublicProductListItem[];
};

export const ProductGrid = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
