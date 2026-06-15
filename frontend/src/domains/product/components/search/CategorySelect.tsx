import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublicCategoriesQuery } from "@/domains/category/hooks/usePublicCategory";

import { useMemo } from "react";
import { flattenCategoryTree } from "../../utils/flattenCategoryTree";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const { data = [] } = usePublicCategoriesQuery();

  const options = useMemo(() => flattenCategoryTree(data), [data]);

  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val === "all" ? "" : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Danh mục" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">Tất cả danh mục</SelectItem>

        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
