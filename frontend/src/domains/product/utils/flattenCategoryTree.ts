import type { PublicCategoryTreeItem } from "@/domains/category/types/public-category.type";

export interface CategoryOption {
  value: string;
  label: string;
}

export const flattenCategoryTree = (
  categories: PublicCategoryTreeItem[],
  depth = 0,
): CategoryOption[] => {
  return categories.flatMap((category) => [
    {
      value: category.id,
      label: `${"— ".repeat(depth)}${category.name}`,
    },

    ...flattenCategoryTree(category.children, depth + 1),
  ]);
};
