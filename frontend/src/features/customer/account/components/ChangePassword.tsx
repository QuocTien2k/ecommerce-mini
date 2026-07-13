import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useChangePasswordMutation } from "../hooks/useChangePassword";
import { useChangePasswordForm } from "../form/use-change-password";
import type { ChangePasswordSchema } from "../schema/account.schema";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error-message";
import { Button } from "@components/ui/button";
import { X } from "lucide-react";
import { AsyncButton } from "@components/common/async-button";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { createPortal } from "react-dom";

type ChangePasswordProps = {
  open: boolean;
  onClose: () => void;
};

export const ChangePassword = ({ open, onClose }: ChangePasswordProps) => {
  const { loading, run } = useScopedLoading();
  const changePasswordMutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitted },
  } = useChangePasswordForm();

  const getErrorVisibility = (field: keyof ChangePasswordSchema) =>
    errors[field] && (dirtyFields[field] || isSubmitted);

  const handleClose = () => {
    if (loading) return;

    reset();
    onClose();
  };

  const onSubmit = async (values: ChangePasswordSchema) => {
    sonnerToast.dismiss("change-password-error");

    try {
      const result = await run(
        async () => {
          return await changePasswordMutation.mutateAsync({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          });
        },
        {
          minDuration: 600,
        },
      );

      sonnerToast.success(result.message);

      handleClose();
    } catch (error) {
      const message = getErrorMessage(error, "Đổi mật khẩu thất bại");
      sonnerToast.error(message, {
        id: "change-password-error",
      });
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-white p-4 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cập nhật mật khẩu</h2>

          <Button
            variant="destructive"
            size="icon"
            onClick={handleClose}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>

            <Input
              id="oldPassword"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              disabled={loading}
              className="h-10 sm:h-11"
              {...register("oldPassword")}
            />

            <p
              className={`overflow-hidden text-sm text-destructive transition-all duration-200 ${
                getErrorVisibility("oldPassword")
                  ? "max-h-10 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {errors.oldPassword?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>

            <Input
              id="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới"
              disabled={loading}
              className="h-10 sm:h-11"
              {...register("newPassword")}
            />

            <p
              className={`overflow-hidden text-sm text-destructive transition-all duration-200 ${
                getErrorVisibility("newPassword")
                  ? "max-h-10 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {errors.newPassword?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>

            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              disabled={loading}
              className="h-10 sm:h-11"
              {...register("confirmPassword")}
            />

            <p
              className={`overflow-hidden text-sm text-destructive transition-all duration-200 ${
                getErrorVisibility("confirmPassword")
                  ? "max-h-10 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {errors.confirmPassword?.message}
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>

            <AsyncButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cập nhật mật khẩu
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
