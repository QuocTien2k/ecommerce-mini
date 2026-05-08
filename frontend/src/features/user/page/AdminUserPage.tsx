import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock } from "lucide-react";
import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import { useUserStatusMutation } from "../hooks/useUserStatusMutation";
import type { AdminUser } from "../types/adminUser.type";
import { AsyncButton } from "@components/common/async-button";
import { Title } from "@components/ui/title-module";
import CopyableText from "@components/common/copyable-text";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { cn } from "@lib/utils";
import { getErrorMessage } from "@lib/error";
import { sonnerToast } from "@lib/sonner-toast";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import AppPagination from "@components/common/pagination";
import { useAdminUsersFilter } from "../hooks/useAdminUsersFilter";

const AdminUserPage = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { loading, run } = useScopedLoading();

  const {
    page,
    setPage,

    keyword,
    setKeyword,

    id,
    setId,

    role,
    setRole,

    isActive,
    setIsActive,

    queryParams,

    resetFilters,
  } = useAdminUsersFilter();

  const { data, isLoading, isFetching } = useAdminUsersQuery(queryParams);

  const { mutateAsync } = useUserStatusMutation();

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    if (pendingId) return; // optional guard
    sonnerToast.dismiss("status-error");

    setPendingId(userId);

    try {
      const result = await run(() => mutateAsync({ userId, isActive }), {
        minDuration: 500,
      });

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Toggle status error:", error);
      sonnerToast.error(getErrorMessage(error, "Thay đổi thất bại"), {
        id: "status-error",
      });
    } finally {
      setPendingId(null);
    }
  };

  const users: AdminUser[] = data?.data?.data ?? [];
  const meta = data?.data.meta;
  const totalPages = meta?.totalPages ?? 1;

  const roleStyles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800 border-purple-300",
    user: "bg-neutral-100 text-neutral-700 border-neutral-200",
  };
  //console.log({ isLoading, isFetching });

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý người dùng" />

          <span className="text-sm text-muted-foreground">
            Tổng số lượng user: {meta?.total ?? 0}
          </span>
        </div>

        <div
          className={cn(
            "border rounded-xl overflow-hidden transition-opacity",
            {
              "opacity-60": isFetching,
            },
          )}
        ></div>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-4">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm email hoặc số điện thoại..."
            className="border rounded-md px-3 py-2"
          />

          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Tìm theo ID..."
            className="border rounded-md px-3 py-2"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Tất cả role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>

          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value as any)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Active</option>
            <option value="false">Locked</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="border px-4 py-2 rounded-md"
          >
            Reset bộ lọc
          </button>
        </div>

        {/* Custom Table */}
        <div className="border rounded-xl overflow-hidden ">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left hover:bg-muted/40 transition-colors">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Họ và tên</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Số điện thoại</th>
                <th className="px-4 py-3 font-medium">Vai trò</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-center font-medium w-35">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <CopyableText value={user.id} />
                  </td>

                  <td className="px-4 py-3 font-medium">{user.fullname}</td>

                  <td className="px-4 py-3">{user.email}</td>

                  <td className="px-4 py-3">{user.phone || "-"}</td>

                  <td className="px-4 py-3">
                    <Badge
                      className={`capitalize border ${roleStyles[user.role.toLowerCase()] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {user.role.toLowerCase()}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Locked"}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-right w-35">
                    <AsyncButton
                      size="sm"
                      className="w-full max-w-27.5 ml-auto"
                      disabled={pendingId !== null}
                      loading={loading && pendingId === user.id}
                      variant={user.isActive ? "destructive" : "default"}
                      //loadingText={user.isActive ? "Đang khóa..." : "Đang mở..."}
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                    >
                      {user.isActive ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </AsyncButton>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <span className="text-sm text-muted-foreground">
                      Không tìm thấy người dùng
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <AppPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </QueryStateWrapper>
  );
};

export default AdminUserPage;
