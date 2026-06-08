import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AssignVoucherUserList } from "./AssignVoucherUserList";
import { useAssignVoucherUsersFilter } from "./useAssignVoucherFilter";
import { useAdminUsersQuery } from "@features/admin/user/hooks/useAdminUsersQuery";
import { useAdminAssignVoucher } from "../../hooks/useAdminAssignVoucher";
import type { AssignVoucherFormOutput } from "../../schema/admin-voucher";
import type { AdminUser } from "@features/admin/user/types/adminUser.type";
import { useCallback } from "react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { sonnerToast } from "@lib/sonner-toast";
import { AsyncButton } from "@components/common/async-button";
import { getErrorMessage } from "@lib/error";

type AssignVoucherFormProps = {
  voucherId: string;
  onSuccess?: () => void;
};

export const AssignVoucherForm = ({
  voucherId,
  onSuccess,
}: AssignVoucherFormProps) => {
  const { keyword, setKeyword, queryParams } = useAssignVoucherUsersFilter();

  const { data } = useAdminUsersQuery(queryParams);

  const users: AdminUser[] = data?.data?.data ?? [];

  const assignVoucherMutation = useAdminAssignVoucher();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<AssignVoucherFormOutput>();

  const { loading, run } = useScopedLoading();

  const onSubmit = async (values: AssignVoucherFormOutput) => {
    try {
      const result = await run(() =>
        assignVoucherMutation.mutateAsync({
          voucherId,
          data: values,
        }),
      );

      sonnerToast.success(result.message);

      onSuccess?.();
    } catch (error) {
      console.error("Assign voucher error:", error);

      sonnerToast.error(getErrorMessage(error, "Gửi voucher thất bại"), {
        id: "voucher-assign-error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Input
          value={keyword}
          placeholder="Tìm kiếm người dùng..."
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <Controller
        control={control}
        name="userIds"
        render={({ field, fieldState }) => {
          const selectedUserIds = field.value ?? [];

          const handleToggleUser = useCallback(
            (userId: string) => {
              const current = field.value ?? [];

              const next = current.includes(userId)
                ? current.filter((id) => id !== userId)
                : [...current, userId];

              field.onChange(next);
            },
            [field.value, field.onChange],
          );

          const handleSelectAll = () => {
            field.onChange(users.map((user) => user.id));
          };

          const handleUnselectAll = () => {
            field.onChange([]);
          };

          return (
            <div className="space-y-3">
              <div className="text-muted-foreground text-sm">
                Đã chọn{" "}
                <span className="font-medium">{selectedUserIds.length}</span>{" "}
                người dùng
              </div>

              <AssignVoucherUserList
                users={users}
                selectedUserIds={selectedUserIds}
                onToggleUser={handleToggleUser}
                onSelectAll={handleSelectAll}
                onUnselectAll={handleUnselectAll}
              />

              {fieldState.error && (
                <p className="text-destructive text-sm">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          );
        }}
      />

      <div className="space-y-2">
        <label htmlFor="usagePerUser" className="text-sm font-medium">
          Số lượt sử dụng mỗi người
        </label>

        <Input
          id="usagePerUser"
          type="number"
          min={1}
          {...register("usagePerUser", {
            valueAsNumber: true,
          })}
        />

        {errors.usagePerUser && (
          <p className="text-destructive text-sm">
            {errors.usagePerUser.message}
          </p>
        )}
      </div>

      <AsyncButton type="submit" loading={loading} disabled={loading}>
        Gửi voucher
      </AsyncButton>
    </form>
  );
};
