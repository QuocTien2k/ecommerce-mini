import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, Unlock } from "lucide-react";
import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import { useUserStatusMutation } from "../hooks/useUserStatusMutation";
import type { AdminUser } from "../types/adminUser.type";
import { AsyncButton } from "@components/common/async-button";
import { Title } from "@components/ui/title-module";
import CopyableText from "@components/common/copyable-text";

const AdminUserPage = () => {
  const [page, setPage] = useState<number>(1);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useAdminUsersQuery({
    page,
    limit: 6,
  });

  const { mutate: setStatus, isPending } = useUserStatusMutation();

  const users: AdminUser[] = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-75 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Title title="Quản lý người dùng" />

        <span className="text-sm text-muted-foreground">
          Tổng số lượng user: {meta?.total ?? 0}
        </span>
      </div>

      {isFetching && (
        <p className="text-xs text-muted-foreground">Updating...</p>
      )}

      {/* Custom Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Họ và tên</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Số điện thoại</th>
              <th className="px-4 py-3 font-medium">vai trò</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium">Hành động</th>
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
                  <Badge variant="secondary" className="capitalize">
                    {user.role.toLowerCase()}
                  </Badge>
                </td>

                <td className="px-4 py-3">
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Locked"}
                  </Badge>
                </td>

                <td className="px-4 py-3 text-right">
                  <AsyncButton
                    size="sm"
                    loading={isPending && pendingId === user.id}
                    variant={user.isActive ? "destructive" : "default"}
                    onClick={() => {
                      setPendingId(user.id);

                      setStatus(
                        {
                          userId: user.id,
                          isActive: user.isActive,
                        },
                        {
                          onSettled: () => setPendingId(null),
                        },
                      );
                    }}
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
                    No users found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {page} / {totalPages}
        </span>

        <div className="flex gap-2">
          <AsyncButton
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </AsyncButton>

          <AsyncButton
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </AsyncButton>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;
