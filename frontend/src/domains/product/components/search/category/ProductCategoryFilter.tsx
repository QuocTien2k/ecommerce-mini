import { usePublicCategoriesQuery } from "@/domains/category/hooks/usePublicCategory";
import type { PublicCategoryTreeItem } from "@/domains/category/types/public-category.type";
import { ProductCategoryFilterNode } from "./ProductCategoryFilterNode";

interface ProductCategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProductCategoryFilter = ({
  value,
  onChange,
}: ProductCategoryFilterProps) => {
  const { data = [] } = usePublicCategoriesQuery();

  //console.log("Data trả về: ", data);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Danh mục</h2>

      <button
        type="button"
        onClick={() => onChange("")}
        className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
          value === "" ? "bg-muted font-medium" : "hover:bg-muted/50"
        }`}
      >
        Tất cả danh mục
      </button>

      <div className="space-y-1">
        {data.map((category: PublicCategoryTreeItem) => (
          <ProductCategoryFilterNode
            key={category.id}
            category={category}
            selectedId={value}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  );
};
