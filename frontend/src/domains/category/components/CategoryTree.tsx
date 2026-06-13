import type { PublicCategoryTreeItem } from "../types/public-category.type";
import { CategoryTreeNode } from "./CategoryTreeNode";

export interface CategoryTreeProps {
  categories: PublicCategoryTreeItem[];
  selectedPath: PublicCategoryTreeItem[];
  onSelectCategory: (category: PublicCategoryTreeItem) => void;
}

export const CategoryTree = ({
  categories,
  selectedPath,
  onSelectCategory,
}: CategoryTreeProps) => {
  return (
    <div className="rounded-lg border bg-white">
      <div className="p-2">
        {categories.map((category) => (
          <CategoryTreeNode
            key={category.id}
            category={category}
            selectedPath={selectedPath}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    </div>
  );
};
