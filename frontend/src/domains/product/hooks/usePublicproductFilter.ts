import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import type { PublicProductListQueryParams } from "../types/public-product.type";

export const usePublicProductFilter = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [brandId, setBrandId] = useState("");

  const [priceSort, setPriceSort] = useState<"" | "asc" | "desc">("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, brandId, priceSort]);

  const queryParams = useMemo<PublicProductListQueryParams>(() => {
    const params: PublicProductListQueryParams = {
      page,
      limit: 12,
    };

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    if (categoryId) {
      params.categoryId = categoryId;
    }

    if (brandId) {
      params.brandId = brandId;
    }

    if (priceSort) {
      params.priceSort = priceSort;
    }

    return params;
  }, [page, debouncedSearch, categoryId, brandId, priceSort]);

  return {
    page,
    setPage,

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
