import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicCategoryTreeItem } from "../types/public-category.type";

export interface CategoryTreeNodeProps {
  category: PublicCategoryTreeItem;
  selectedPath: PublicCategoryTreeItem[];
  onSelectCategory: (category: PublicCategoryTreeItem) => void;
}

export const CategoryTreeNode = ({
  category,
  selectedPath,
  onSelectCategory,
}: CategoryTreeNodeProps) => {
  const isSelected = selectedPath.some((item) => item.id === category.id);

  const hasChildren = category.children.length > 0;

  const isExpanded =
    hasChildren && selectedPath.some((item) => item.id === category.id);

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelectCategory(category)}
        className={cn(
          "cursor-pointer flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
          "hover:text-primary",
          isSelected && "font-semibold text-primary",
        )}
      >
        <span>{category.name}</span>

        {hasChildren && (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded && "rotate-90",
            )}
          />
        )}
      </button>

      {hasChildren && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isExpanded ? "max-h-250 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="ml-4 border-l pl-2">
            {category.children.map((child) => (
              <CategoryTreeNode
                key={child.id}
                category={child}
                selectedPath={selectedPath}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
