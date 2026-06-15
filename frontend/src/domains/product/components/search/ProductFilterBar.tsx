import { SearchInput } from "./SearchInput";
import { CategorySelect } from "./CategorySelect";
import { BrandSelect } from "./BrandSelect";
import { PriceSortSelect } from "./PriceSortSelect";

interface ProductFilterBarProps {
  filters: {
    search: string;
    categoryId: string;
    brandId: string;
    priceSort: "" | "asc" | "desc";
  };

  actions: {
    setSearch: (value: string) => void;
    setCategoryId: (value: string) => void;
    setBrandId: (value: string) => void;
    setPriceSort: (value: "" | "asc" | "desc") => void;
  };
}

export const ProductFilterBar = ({
  filters,
  actions,
}: ProductFilterBarProps) => {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <SearchInput value={filters.search} onChange={actions.setSearch} />

      <CategorySelect
        value={filters.categoryId}
        onChange={actions.setCategoryId}
      />

      <BrandSelect value={filters.brandId} onChange={actions.setBrandId} />

      <PriceSortSelect
        value={filters.priceSort}
        onChange={actions.setPriceSort}
      />
    </div>
  );
};
