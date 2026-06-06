import { useEffect, useMemo, useState } from "react";

import type { GetUsersParams } from "../types/adminUser.type";
import type { Role } from "@/types/role";

import { useDebounce } from "@/hooks/useDebounce";

export const useAdminUsersFilter = () => {
  const [page, setPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [id, setId] = useState("");

  const [role, setRole] = useState<Role | "">("");

  const [isActive, setIsActive] = useState<"" | "true" | "false">("");

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, id, role, isActive]);

  const queryParams = useMemo<GetUsersParams>(() => {
    const params: GetUsersParams = {
      page,
      limit: 6,
    };

    if (id.trim()) {
      params.id = id.trim();
    }

    if (debouncedKeyword.trim()) {
      params.keyword = debouncedKeyword.trim();
    }

    if (role) {
      params.role = role;
    }

    if (isActive !== "") {
      params.isActive = isActive === "true";
    }

    return params;
  }, [page, id, debouncedKeyword, role, isActive]);

  const resetFilters = () => {
    setPage(1);

    setKeyword("");
    setId("");

    setRole("");
    setIsActive("");
  };

  const filters = {
    keyword,
    id,
    role,
    isActive,
  };

  const filterActions = {
    setKeyword,
    setId,
    setRole,
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
