import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { FlatCategoryItem } from "@/features/categories/types/admin-category.type";

type Props = {
  filters: {
    search: string;
    isActive: "" | "true" | "false";
    categoryId: string;
  };

  actions: {
    setSearch: (value: string) => void;
    setIsActive: (value: "" | "true" | "false") => void;
    setCategoryId: (value: string) => void;
  };

  flatCategories: FlatCategoryItem[];

  onReset: () => void;
};

const AdminProductFilter = ({
  filters,
  actions,
  flatCategories,
  onReset,
}: Props) => {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="min-w-40 flex-1">
        <Input
          value={filters.search}
          onChange={(e) => actions.setSearch(e.target.value)}
          placeholder="Tìm theo tên sản phẩm..."
        />
      </div>

      {/* Category */}
      <div className="w-72">
        <Select
          value={filters.categoryId || "ALL"}
          onValueChange={(value) =>
            actions.setCategoryId(value === "ALL" ? "" : value)
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả danh mục</SelectItem>

            {flatCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="w-60">
        <Select
          value={filters.isActive || "ALL"}
          onValueChange={(value) =>
            actions.setIsActive(
              value === "ALL" ? "" : (value as "" | "true" | "false"),
            )
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

            <SelectItem value="true">Đang hoạt động</SelectItem>

            <SelectItem value="false">Tạm khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset */}
      <Button variant="warning" onClick={onReset} className="shrink-0 px-5">
        Reset
      </Button>
    </div>
  );
};

export default AdminProductFilter;
