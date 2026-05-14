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

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, isActive, categoryId]);

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

    return params;
  }, [page, debouncedSearch, isActive, categoryId]);

  const resetFilters = () => {
    setPage(1);

    setSearch("");

    setIsActive("");

    setCategoryId("");
  };

  const filters = {
    search,
    isActive,
    categoryId,
  };

  const filterActions = {
    setSearch,
    setIsActive,
    setCategoryId,
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
