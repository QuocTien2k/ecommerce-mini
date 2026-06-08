import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Role } from "@/types/role";
import type { GetUsersParams } from "@features/admin/user/types/adminUser.type";

export const useAssignVoucherUsersFilter = () => {
  const [keyword, setKeyword] = useState("");

  const debouncedKeyword = useDebounce(keyword, 500);

  const queryParams = useMemo<GetUsersParams>(
    () => ({
      page: 1,
      limit: 20,

      role: Role.USER,
      isActive: true,

      ...(debouncedKeyword.trim()
        ? {
            keyword: debouncedKeyword.trim(),
          }
        : {}),
    }),
    [debouncedKeyword],
  );

  return {
    keyword,
    setKeyword,

    queryParams,
  };
};
