import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import type { AdminBrandQueryParams } from "../types/admin-brand.type";

export const useAdminBrandFilter = () => {
  const [page, setPage] = useState(1);

  const [name, setName] = useState("");

  /* "": không filter, true: active, false: inactive */
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const debouncedName = useDebounce(name, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedName, isActive, fromDate, toDate]);

  const queryParams = useMemo<AdminBrandQueryParams>(() => {
    const params: AdminBrandQueryParams = {
      page,
      limit: 10,
    };

    // name
    if (debouncedName.trim()) {
      params.name = debouncedName.trim();
    }

    // active
    if (isActive !== "") {
      params.isActive = isActive === "true";
    }

    // from date
    if (fromDate) {
      params.fromDate = fromDate;
    }

    // to date
    if (toDate) {
      params.toDate = toDate;
    }

    return params;
  }, [page, debouncedName, isActive, fromDate, toDate]);

  const resetFilters = () => {
    setPage(1);

    setName("");

    setIsActive("");

    setFromDate("");

    setToDate("");
  };

  const filters = {
    name,
    isActive,
    fromDate,
    toDate,
  };

  const filterActions = {
    setName,
    setIsActive,
    setFromDate,
    setToDate,
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
