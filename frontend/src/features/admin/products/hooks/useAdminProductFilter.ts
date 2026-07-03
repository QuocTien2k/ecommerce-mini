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

  /* "": không filter */
  const [minRating, setMinRating] = useState<"" | number>("");

  const debouncedSearch = useDebounce(search, 500);

  //reset page
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, isActive, categoryId, brandId, priceSort, minRating]);

  //query
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

    // minimum rating
    if (minRating !== "") {
      params.minRating = minRating;
    }

    return params;
  }, [
    page,
    debouncedSearch,
    isActive,
    categoryId,
    brandId,
    priceSort,
    minRating,
  ]);

  const resetFilters = () => {
    setPage(1);

    setSearch("");

    setIsActive("");

    setCategoryId("");

    setBrandId("");

    setPriceSort("");

    setMinRating("");
  };

  const filters = {
    search,
    isActive,
    categoryId,
    brandId,
    priceSort,
    minRating,
  };

  const filterActions = {
    setSearch,
    setIsActive,
    setCategoryId,
    setBrandId,
    setPriceSort,
    setMinRating,
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
