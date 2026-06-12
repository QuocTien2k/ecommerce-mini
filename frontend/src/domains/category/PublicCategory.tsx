import { useState } from "react";
import { usePublicCategoriesQuery } from "./hooks/usePublicCategory";
import { CategoryStrip } from "./components/CategoryStrip";
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
      const index = prev.findIndex((c) => c.id === category.id);

      // nếu click lại cùng node → truncate
      if (index !== -1) return prev.slice(0, index + 1);

      return [...prev, category];
    });
  };

  const activeCategoryId =
    selectedPath.length > 0 ? selectedPath[selectedPath.length - 1].id : null;

  const currentLevelCategories =
    selectedPath.length === 0
      ? data
      : selectedPath[selectedPath.length - 1].children;

  const { data: products, isLoading: isProductsLoading } =
    usePublicProductsQuery({
      categoryId: activeCategoryId ?? undefined,
    });

  //console.log("Data: ", products);

  if (isLoading) return <div>Đang tải ...</div>;

  return (
    <div className="w-full">
      <CategoryStrip
        categories={currentLevelCategories}
        activeCategoryId={selectedPath[selectedPath.length - 1]?.id ?? null}
        onSelectCategory={handleSelect}
      />

      {/* PRODUCTS LAYER */}
      <div className="mt-4">
        <QueryStateWrapper isLoading={isProductsLoading}>
          {products?.data.data.length ? (
            <ProductGrid products={products.data.data} />
          ) : (
            <ProductNotFound />
          )}
        </QueryStateWrapper>
      </div>
    </div>
  );
};
