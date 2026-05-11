import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { FlatCategoryItem } from "../types/admin-category.type";

type Props = {
  filters: {
    search: string;
    //isActive: "" | "true" | "false";
    isDeleted: "" | "true" | "false";
    parentId: string;
  };

  actions: {
    setSearch: (value: string) => void;
    //setIsActive: (value: "" | "true" | "false") => void;
    setIsDeleted: (value: "" | "true" | "false") => void;
    setParentId: (value: string) => void;
  };

  flatCategories: FlatCategoryItem[];

  onReset: () => void;
};

const AdminCategoryFilter = ({
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
          placeholder="Tìm theo tên danh mục..."
        />
      </div>

      {/* Parent Category */}
      <div className="w-72">
        <Select
          value={filters.parentId || "ALL"}
          onValueChange={(value) =>
            actions.setParentId(value === "ALL" ? "" : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">Tất cả danh mục</SelectItem>

            <SelectItem value="null">Danh mục cha</SelectItem>

            {flatCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      {/* <div className="w-60">
        <Select
          value={filters.isActive || "ALL"}
          onValueChange={(value) =>
            actions.setIsActive(
              value === "ALL" ? "" : (value as "" | "true" | "false"),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

            <SelectItem value="true">Hoạt động</SelectItem>

            <SelectItem value="false">Tạm khóa</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Deleted/Restore Status */}
      <div className="w-60">
        <Select
          value={filters.isDeleted || "ALL"}
          onValueChange={(value) =>
            actions.setIsDeleted(
              value === "ALL" ? "" : (value as "" | "true" | "false"),
            )
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

            <SelectItem value="true">Đã xóa</SelectItem>

            <SelectItem value="false">Đang hoạt động</SelectItem>
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

export default AdminCategoryFilter;
