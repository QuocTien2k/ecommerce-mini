import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { FlatCategoryItem } from "@features/admin/categories/types/admin-category.type";
import type { AdminBrandItem } from "@features/admin/brands/types/admin-brand.type";

type Props = {
  filters: {
    search: string;
    isActive: "" | "true" | "false";
    categoryId: string;
    brandId: string;
    priceSort: "" | "asc" | "desc";
    minRating: "" | number;
  };

  actions: {
    setSearch: (value: string) => void;
    setIsActive: (value: "" | "true" | "false") => void;
    setCategoryId: (value: string) => void;
    setBrandId: (value: string) => void;
    setPriceSort: (value: "" | "asc" | "desc") => void;
    setMinRating: (value: "" | number) => void;
  };

  flatCategories: FlatCategoryItem[];
  brands: AdminBrandItem[];

  onReset: () => void;
};

const AdminProductFilter = ({
  filters,
  actions,
  flatCategories,
  brands = [],
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
      <div className="w-56">
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

            {flatCategories
              .filter((category) => category.level === 3)
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="w-48">
        <Select
          value={filters.brandId || "ALL"}
          onValueChange={(value) =>
            actions.setBrandId(value === "ALL" ? "" : value)
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Tất cả thương hiệu" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả thương hiệu</SelectItem>

            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Sort */}
      <div className="w-44">
        <Select
          value={filters.priceSort || "DEFAULT"}
          onValueChange={(value) =>
            actions.setPriceSort(
              value === "DEFAULT" ? "" : (value as "asc" | "desc"),
            )
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Sắp xếp giá" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="DEFAULT">Giá tiền</SelectItem>

            <SelectItem value="asc">Giá thấp đến cao</SelectItem>

            <SelectItem value="desc">Giá cao đến thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rating */}
      <div className="w-44">
        <Select
          value={
            filters.minRating === "" ? "ALL" : filters.minRating.toString()
          }
          onValueChange={(value) =>
            actions.setMinRating(value === "ALL" ? "" : Number(value))
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Đánh giá tối thiểu" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem value="ALL">Tất cả đánh giá</SelectItem>

            <SelectItem value="5">Từ 5 sao</SelectItem>

            <SelectItem value="4">Từ 4 sao</SelectItem>

            <SelectItem value="3">Từ 3 sao</SelectItem>

            <SelectItem value="2">Từ 2 sao</SelectItem>

            <SelectItem value="1">Từ 1 sao</SelectItem>

            <SelectItem value="0">Từ 0 sao</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="w-44">
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
