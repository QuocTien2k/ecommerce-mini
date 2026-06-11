import { useState } from "react";
import { usePublicCategoriesQuery } from "./hooks/usePublicCategory";
import { CategoryStrip } from "./components/CategoryStrip";

export const PublicCategory = () => {
  const { data, isLoading } = usePublicCategoriesQuery();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  if (isLoading) return <div>Loading categories...</div>;
  if (!data) return null;

  return (
    <div className="w-full">
      <CategoryStrip
        categories={data ?? []}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />
    </div>
  );
};
