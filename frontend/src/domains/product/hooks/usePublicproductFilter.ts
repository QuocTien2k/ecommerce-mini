import { useMemo, useRef } from "react";
import type { PublicProductListQueryParams } from "../types/public-product.type";
import { usePaginationScroll } from "@/hooks/usePaginationScroll";
import { useSearchParams } from "react-router-dom";

export const usePublicProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { scrollToTop } = usePaginationScroll();

  const debounceRef = useRef<number | null>(null);

  const page = Number(searchParams.get("trang") || 1);
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";
  const rawPriceSort = searchParams.get("priceSort");
  const search = searchParams.get("search") || "";
  const rawMinRating = searchParams.get("minRating");

  const priceSort: "" | "asc" | "desc" =
    rawPriceSort === "asc" || rawPriceSort === "desc" ? rawPriceSort : "";

  const minRating =
    rawMinRating !== null && !Number.isNaN(Number(rawMinRating))
      ? Number(rawMinRating)
      : undefined;

  const updateParams = (updates: Record<string, string | number | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === null) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      return next;
    });

    scrollToTop();
  };

  const goToPage = (p: number) => {
    updateParams({ trang: p });
    //scrollToTop();
  };

  /**
   * Debounced search setter (thay thế useDebounce hook)
   */
  const setSearch = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateParams({
        search: value.trim(),
        trang: 1,
      });
    }, 500);
  };

  const setCategoryId = (v: string) => {
    updateParams({
      categoryId: v,
      trang: 1,
    });
  };

  const setBrandId = (v: string) => {
    updateParams({
      brandId: v,
      trang: 1,
    });
  };

  const setPriceSort = (v: "asc" | "desc" | "") => {
    updateParams({
      priceSort: v,
      trang: 1,
    });
  };

  const setMinRating = (v?: number) => {
    updateParams({
      minRating: v ?? null,
      trang: 1,
    });
  };

  const queryParams = useMemo(() => {
    const params: PublicProductListQueryParams = {
      page,
      limit: 12,
    };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    if (brandId) params.brandId = brandId;
    if (priceSort) params.priceSort = priceSort;
    if (minRating !== undefined) {
      params.minRating = minRating;
    }

    return params;
  }, [page, categoryId, brandId, priceSort, search, minRating]);

  const resetFilters = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setSearchParams({});
  };

  return {
    page,
    goToPage,

    filters: {
      search,
      categoryId,
      brandId,
      priceSort,
      minRating,
    },

    filterActions: {
      setSearch,
      setCategoryId,
      setBrandId,
      setPriceSort,
      setMinRating,
      resetFilters,
    },

    queryParams,
  };
};
