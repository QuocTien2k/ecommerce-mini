import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  GetAdminVouchersQuery,
  VoucherScope,
  VoucherStatus,
  VoucherTarget,
  VoucherType,
} from "../types/admin-voucher.type";

export const useAdminVoucherFilter = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  /* "": no filter */
  const [type, setType] = useState<"" | VoucherType>("");

  /* "": no filter */
  const [scope, setScope] = useState<"" | VoucherScope>("");

  const [target, setTarget] = useState<"" | VoucherTarget>("");

  /* "": no filter */
  const [status, setStatus] = useState<"" | VoucherStatus>("");

  /* "": no filter */
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, scope, target, status, isActive]);

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

    // target
    if (target) {
      params.target = target;
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
  }, [page, debouncedSearch, type, scope, target, status, isActive]);

  const resetFilters = () => {
    setPage(1);

    setSearch("");

    setType("");

    setScope("");

    setTarget("");

    setStatus("");

    setIsActive("");
  };

  const filters = {
    search,
    type,
    scope,
    target,
    status,
    isActive,
  };

  const filterActions = {
    setSearch,
    setType,
    setScope,
    setTarget,
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
