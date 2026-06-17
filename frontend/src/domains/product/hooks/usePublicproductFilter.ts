import { useMemo, useRef } from "react";
import type { PublicProductListQueryParams } from "../types/public-product.type";
import { usePaginationScroll } from "@/hooks/usePaginationScroll";
import { useSearchParams } from "react-router-dom";

export const usePublicProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { scrollToTop } = usePaginationScroll();

  const debounceRef = useRef<number | null>(null);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";
  const rawPriceSort = searchParams.get("priceSort");

  const priceSort: "" | "asc" | "desc" =
    rawPriceSort === "asc" || rawPriceSort === "desc" ? rawPriceSort : "";

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
  };

  const goToPage = (p: number) => {
    updateParams({ page: p });
    scrollToTop();
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
        page: 1,
      });
    }, 500);
  };

  const setCategoryId = (v: string) => {
    updateParams({
      categoryId: v,
      page: 1,
    });
  };

  const setBrandId = (v: string) => {
    updateParams({
      brandId: v,
      page: 1,
    });
  };

  const setPriceSort = (v: "asc" | "desc" | "") => {
    updateParams({
      priceSort: v,
      page: 1,
    });
  };

  const queryParams = useMemo(() => {
    const params: PublicProductListQueryParams = {
      page,
      limit: 12,
    };

    if (search.trim()) params.search = search.trim();
    if (categoryId) params.categoryId = categoryId;
    if (brandId) params.brandId = brandId;
    if (priceSort) params.priceSort = priceSort;

    return params;
  }, [page, search, categoryId, brandId, priceSort]);

  return {
    page,
    goToPage,

    filters: {
      search,
      categoryId,
      brandId,
      priceSort,
    },

    filterActions: {
      setSearch,
      setCategoryId,
      setBrandId,
      setPriceSort,
    },

    queryParams,
  };
};
