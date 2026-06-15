import type { PublicCategoryTreeItem } from "@/domains/category/types/public-category.type";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductCategoryFilterNodeProps {
  category: PublicCategoryTreeItem;
  selectedId: string;
  onSelect: (id: string) => void;
}

export const ProductCategoryFilterNode = ({
  category,
  selectedId,
  onSelect,
}: ProductCategoryFilterNodeProps) => {
  const [expanded, setExpanded] = useState(category.level === 1);
  const isSelected = selectedId === category.id;

  const hasChildren = category.children.length > 0;

  return (
    <div>
      <div
        className={cn("flex items-center", isSelected && "rounded-md bg-muted")}
        style={{
          marginLeft: `${(category.level - 1) * 16}px`,
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="rounded p-1 hover:bg-muted"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                expanded && "rotate-90",
              )}
            />
          </button>
        ) : (
          <div className="w-6" />
        )}

        <button
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex-1 rounded-md px-2 py-2 text-left text-sm",
            isSelected ? "font-medium" : "hover:bg-muted/50",
          )}
        >
          {category.name}
        </button>
      </div>

      {expanded && hasChildren && (
        <div>
          {category.children.map((child) => (
            <ProductCategoryFilterNode
              key={child.id}
              category={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
