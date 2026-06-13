import { useState } from "react";
import { usePublicCategoriesQuery } from "./hooks/usePublicCategory";
import { CategoryTree } from "./components/CategoryTree";
import type { PublicCategoryTreeItem } from "./types/public-category.type";
import { usePublicProductsQuery } from "../product/hooks/usePublicProduct";
import { ProductGrid } from "../product/components/ProductGrid";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { ProductNotFound } from "@components/product/ProductNotFound";

export const PublicCategory = () => {
  const { data = [], isLoading } = usePublicCategoriesQuery();

  const [selectedPath, setSelectedPath] = useState<PublicCategoryTreeItem[]>(
    [],
  );

  const handleSelect = (category: PublicCategoryTreeItem) => {
    setSelectedPath((prev) => {
      const levelIndex = category.level - 1;

      return [...prev.slice(0, levelIndex), category];
    });
  };

  const activeCategoryId =
    selectedPath.length > 0 ? selectedPath[selectedPath.length - 1].id : null;

  const { data: products, isLoading: isProductsLoading } =
    usePublicProductsQuery({
      categoryId: activeCategoryId ?? undefined,
    });

  //console.log("Data: ", products);

  if (isLoading) return <div>Đang tải ...</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="sticky top-4 self-start">
        <CategoryTree
          categories={data}
          selectedPath={selectedPath}
          onSelectCategory={handleSelect}
        />
      </div>

      {/* PRODUCTS LAYER */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3">
          <h2 className="font-medium">Sản phẩm</h2>
        </div>

        <div className="p-4">
          <QueryStateWrapper isLoading={isProductsLoading}>
            {products?.data.data.length ? (
              <ProductGrid products={products.data.data} />
            ) : (
              <ProductNotFound />
            )}
          </QueryStateWrapper>
        </div>
      </div>
    </div>
  );
};
