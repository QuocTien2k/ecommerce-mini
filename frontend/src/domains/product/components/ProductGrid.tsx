import type { PublicProductListItem } from "../types/public-product.type";

type Props = {
  products: PublicProductListItem[];
};

export const ProductGrid = ({ products }: Props) => {
  if (!products.length) {
    return <div className="text-sm text-gray-500">No products</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <div key={p.id} className="border rounded p-3">
          <div className="font-medium text-sm">{p.name}</div>

          <div className="text-sm text-gray-700">{p.price}</div>
        </div>
      ))}
    </div>
  );
};
