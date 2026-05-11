import { useEffect, useMemo, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import type { AdminCategoryQueryParams } from "../types/admin-category.type";

export const useAdminCategoryFilter = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  /* "": không filter, true: active, false:inactive */
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");

  /* "": không filter, null: category cha, uuid: category con của parent */
  const [parentId, setParentId] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, isActive, parentId]);

  const queryParams = useMemo<AdminCategoryQueryParams>(() => {
    const params: AdminCategoryQueryParams = {
      page,
      limit: 10,
    };

    //search
    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    //active
    if (isActive !== "") {
      params.isActive = isActive === "true";
    }

    //parent
    if (parentId) {
      params.parentId = parentId;
    }

    return params;
  }, [page, debouncedSearch, isActive, parentId]);

  const resetFilters = () => {
    setPage(1);

    setSearch("");

    setIsActive("");

    setParentId("");
  };

  const filters = {
    search,
    isActive,
    parentId,
  };

  const filterActions = {
    setSearch,
    setIsActive,
    setParentId,
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
