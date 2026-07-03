import { ProductCategoryFilter } from "./category/ProductCategoryFilter";
import { ProductBrandFilter } from "./brand/ProductBrandFilter";
import { PriceSortFilter } from "./PriceSortSelect";
import { Button } from "@components/ui/button";
import { RatingFilter } from "./RatingFilter";

interface ProductFilterProps {
  value: {
    categoryId: string;
    brandId: string;
    priceSort: "asc" | "desc" | "";
    minRating?: number;
  };

  actions: {
    setSearch: (v: string) => void;
    setCategoryId: (v: string) => void;
    setBrandId: (v: string) => void;
    setPriceSort: (v: "asc" | "desc" | "") => void;
    setMinRating: (v?: number) => void;
    resetFilters: () => void;
  };
}

export const ProductFilters = ({ value, actions }: ProductFilterProps) => {
  const hasActiveFilters =
    !!value.categoryId ||
    !!value.brandId ||
    !!value.priceSort ||
    value.minRating !== undefined;

  return (
    <div className="h-full rounded-lg border bg-white p-4">
      <div className="space-y-6">
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

        {/* <Rating /> */}
        <section className="border-t pt-4">
          <RatingFilter
            value={value.minRating}
            onChange={actions.setMinRating}
          />
        </section>
      </div>
    </div>
  );
};
