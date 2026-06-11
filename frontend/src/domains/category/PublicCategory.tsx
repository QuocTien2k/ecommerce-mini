import { useState } from "react";
import { usePublicCategoriesQuery } from "./hooks/usePublicCategory";
import { CategoryStrip } from "./components/CategoryStrip";
import type { PublicCategoryTreeItem } from "./types/public-category.type";

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

  const currentLevelCategories =
    selectedPath.length === 0
      ? data
      : selectedPath[selectedPath.length - 1].children;

  if (isLoading) return <div>Loading categories...</div>;
  if (!data) return null;

  return (
    <div className="w-full">
      <CategoryStrip
        categories={currentLevelCategories}
        activeCategoryId={selectedPath[selectedPath.length - 1]?.id ?? null}
        onSelectCategory={handleSelect}
      />
    </div>
  );
};
