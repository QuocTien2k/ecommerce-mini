import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import type { AdminProductListQueryParams } from "../types/admin-product.type";

export const useAdminProductFilter = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  /* "": không filter, true: active, false: inactive */
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");

  /* "": không filter */
  const [categoryId, setCategoryId] = useState("");

  /* "": không filter */
  const [brandId, setBrandId] = useState("");

  /* "": không sort */
  const [priceSort, setPriceSort] = useState<"" | "asc" | "desc">("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, isActive, categoryId, brandId, priceSort]);

  const queryParams = useMemo<AdminProductListQueryParams>(() => {
    const params: AdminProductListQueryParams = {
      page,
      limit: 10,
    };

    // search
    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    // active
    if (isActive !== "") {
      params.isActive = isActive === "true";
    }

    // category
    if (categoryId) {
      params.categoryId = categoryId;
    }

    // brand
    if (brandId) {
      params.brandId = brandId;
    }

    // price sort
    if (priceSort) {
      params.priceSort = priceSort;
    }

    return params;
  }, [page, debouncedSearch, isActive, categoryId, brandId, priceSort]);

  const resetFilters = () => {
    setPage(1);

    setSearch("");

    setIsActive("");

    setCategoryId("");

    setBrandId("");

    setPriceSort("");
  };

  const filters = {
    search,
    isActive,
    categoryId,
    brandId,
    priceSort,
  };

  const filterActions = {
    setSearch,
    setIsActive,
    setCategoryId,
    setBrandId,
    setPriceSort,
  };

  return {
    page,
    setPage,

    filters,
    filterActions,

    queryParams,

    resetFilters,
  };
};
