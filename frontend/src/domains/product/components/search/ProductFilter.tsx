import { SearchInput } from "./SearchInput";
import { ProductCategoryFilter } from "./category/ProductCategoryFilter";
import { ProductBrandFilter } from "./brand/ProductBrandFilter";
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

        {/* Category */}
        <section className="border-t pt-4">
          <ProductCategoryFilter
            value={filters.categoryId}
            onChange={actions.setCategoryId}
          />
        </section>

        {/* Brand */}
        <section className="border-t pt-4">
          <ProductBrandFilter
            value={filters.brandId}
            onChange={actions.setBrandId}
          />
        </section>

        {/* Price */}
        <section className="border-t pt-4">
          <PriceSortSelect
            value={filters.priceSort}
            onChange={actions.setPriceSort}
          />
        </section>

        {/* <RatingSelect /> */}
      </div>
    </div>
  );
};
