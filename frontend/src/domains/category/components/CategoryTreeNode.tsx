import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicCategoryTreeItem } from "../types/public-category.type";

export interface CategoryTreeNodeProps {
  category: PublicCategoryTreeItem;
  selectedPath: PublicCategoryTreeItem[];
  expandedIds: Set<string>;
  setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onSelectCategory: (category: PublicCategoryTreeItem) => void;
}

export const CategoryTreeNode = ({
  category,
  selectedPath,
  expandedIds,
  setExpandedIds,
  onSelectCategory,
}: CategoryTreeNodeProps) => {
  const isSelected = selectedPath.some((item) => item.id === category.id);

  const hasChildren = category.children.length > 0;

  const isExpanded = expandedIds.has(category.id);

  const toggleExpand = () => {
    setExpandedIds((prev) => {
      const next = new Set(prev);

      if (next.has(category.id)) {
        next.delete(category.id);
      } else {
        next.add(category.id);
      }

      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        {hasChildren ? (
          <button
            type="button"
            onClick={toggleExpand}
            className="cursor-pointer rounded p-1 hover:bg-muted"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-90",
              )}
            />
          </button>
        ) : (
          <div className="w-6" />
        )}

        <button
          type="button"
          onClick={() => onSelectCategory(category)}
          className={cn(
            "cursor-pointer flex-1 rounded-md px-2 py-2 text-left text-sm transition-colors",
            "hover:text-primary",
            isSelected && "font-semibold text-primary",
          )}
        >
          {category.name}
        </button>
      </div>

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
                expandedIds={expandedIds}
                setExpandedIds={setExpandedIds}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
