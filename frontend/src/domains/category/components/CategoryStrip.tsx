import { cn } from "@/lib/utils";
import type { PublicCategoryTreeItem } from "../types/public-category.type";

export interface CategoryStripProps {
  categories: PublicCategoryTreeItem[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export const CategoryStrip = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryStripProps) => {
  return (
    <div className="w-full overflow-x-auto border-b bg-white">
      <div className="flex gap-2 p-2 min-w-max">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-md whitespace-nowrap text-sm transition",
                "hover:bg-gray-100",
                isActive && "bg-gray-900 text-white hover:bg-gray-900",
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
