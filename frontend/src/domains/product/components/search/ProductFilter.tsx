import { SearchInput } from "./SearchInput";
import { ProductCategoryFilter } from "./category/ProductCategoryFilter";
import { ProductBrandFilter } from "./brand/ProductBrandFilter";
import { PriceSortSelect } from "./PriceSortSelect";

interface ProductFilterProps {
  value: {
    search: string;
    categoryId: string;
    brandId: string;
    priceSort: "asc" | "desc" | "";
  };

  actions: {
    setSearch: (v: string) => void;
    setCategoryId: (v: string) => void;
    setBrandId: (v: string) => void;
    setPriceSort: (v: "asc" | "desc" | "") => void;
  };
}

export const ProductFilters = ({ value, actions }: ProductFilterProps) => {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="space-y-4">
        <SearchInput value={value.search} onChange={actions.setSearch} />

        {/* Category */}
        <section className="border-t pt-4">
          <ProductCategoryFilter
            value={value.categoryId}
            onChange={actions.setCategoryId}
          />
        </section>

        {/* Brand */}
        <section className="border-t pt-4">
          <ProductBrandFilter
            value={value.brandId}
            onChange={actions.setBrandId}
          />
        </section>

        {/* Price */}
        <section className="border-t pt-4">
          <PriceSortSelect
            value={value.priceSort}
            onChange={actions.setPriceSort}
          />
        </section>

        {/* <RatingSelect /> */}
      </div>
    </div>
  );
};
