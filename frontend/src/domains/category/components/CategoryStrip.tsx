import { cn } from "@/lib/utils";
import type { PublicCategoryTreeItem } from "../types/public-category.type";

export interface CategoryStripProps {
  categories: PublicCategoryTreeItem[];
  activeCategoryId: string | null;
  onSelectCategory: (category: PublicCategoryTreeItem) => void;
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
          //highlight
          const isActive = cat.id === activeCategoryId;
          //hiển thị affordance
          const hasChildren = cat.children?.length > 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-md whitespace-nowrap text-sm transition flex items-center gap-1",
                "hover:bg-gray-100",
                isActive && "bg-gray-900 text-white hover:bg-gray-900",
              )}
            >
              <span>{cat.name}</span>

              {hasChildren && (
                <span
                  className={cn(
                    "text-xs opacity-60",
                    isActive ? "text-white" : "text-gray-500",
                  )}
                >
                  ›
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
