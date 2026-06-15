import { SearchInput } from "./SearchInput";
import { CategorySelect } from "./CategorySelect";
import { BrandSelect } from "./BrandSelect";
import { PriceSortSelect } from "./PriceSortSelect";

interface ProductFilterProps {
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

export const ProductFilters = ({ filters, actions }: ProductFilterProps) => {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="space-y-4">
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

        {/* <RatingSelect /> */}
      </div>
    </div>
  );
};
