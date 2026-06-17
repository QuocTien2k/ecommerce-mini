import { ProductCategoryFilter } from "./category/ProductCategoryFilter";
import { ProductBrandFilter } from "./brand/ProductBrandFilter";
import { PriceSortFilter } from "./PriceSortSelect";
import { Button } from "@components/ui/button";

interface ProductFilterProps {
  value: {
    categoryId: string;
    brandId: string;
    priceSort: "asc" | "desc" | "";
  };

  actions: {
    setSearch: (v: string) => void;
    setCategoryId: (v: string) => void;
    setBrandId: (v: string) => void;
    setPriceSort: (v: "asc" | "desc" | "") => void;
    resetFilters: () => void;
  };
}

export const ProductFilters = ({ value, actions }: ProductFilterProps) => {
  const hasActiveFilters =
    !!value.categoryId || !!value.brandId || !!value.priceSort;

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Bộ lọc</h3>

          <Button
            type="button"
            onClick={actions.resetFilters}
            disabled={!hasActiveFilters}
            variant="warning"
          >
            Reset
          </Button>
        </div>

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
          <PriceSortFilter
            value={value.priceSort}
            onChange={actions.setPriceSort}
          />
        </section>

        {/* <RatingSelect /> */}
      </div>
    </div>
  );
};
