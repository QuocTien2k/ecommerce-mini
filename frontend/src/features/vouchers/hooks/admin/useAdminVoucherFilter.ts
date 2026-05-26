import { useEffect, useMemo, useState } from "react";
import type {
  GetAdminVouchersQuery,
  VoucherScope,
  VoucherStatus,
  VoucherType,
} from "@features/vouchers/types/admin-voucher.type";
import { useDebounce } from "@/hooks/useDebounce";

export const useAdminVoucherFilter = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  /* "": no filter */
  const [type, setType] = useState<"" | VoucherType>("");

  /* "": no filter */
  const [scope, setScope] = useState<"" | VoucherScope>("");

  /* "": no filter */
  const [status, setStatus] = useState<"" | VoucherStatus>("");

  /* "": no filter */
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, scope, status, isActive]);

  const queryParams = useMemo<GetAdminVouchersQuery>(() => {
    const params: GetAdminVouchersQuery = {
      page,
      limit: 10,
    };

    // search
    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    // type
    if (type) {
      params.type = type;
    }

    // scope
    if (scope) {
      params.scope = scope;
    }

    // status
    if (status) {
      params.status = status;
    }

    // active
    if (isActive !== "") {
      params.isActive = isActive === "true";
    }

    return params;
  }, [page, debouncedSearch, type, scope, status, isActive]);

  const resetFilters = () => {
    setPage(1);

    setSearch("");

    setType("");

    setScope("");

    setStatus("");

    setIsActive("");
  };

  const filters = {
    search,
    type,
    scope,
    status,
    isActive,
  };

  const filterActions = {
    setSearch,
    setType,
    setScope,
    setStatus,
    setIsActive,
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
