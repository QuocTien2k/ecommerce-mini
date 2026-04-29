import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { Input } from "@components/ui/input";
import { authApi } from "@features/auth/auth.api";
import { getErrorMessage } from "@lib/error";
import { sonnerToast } from "@lib/sonner-toast";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmError, setShowConfirmError] = useState(false);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);

    if (showPasswordError) setShowPasswordError(false);

    if (value && !isValidPassword(value)) {
      setShowPasswordError(true);
    }
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);

    if (showConfirmError) setShowConfirmError(false);

    if (value && value !== newPassword) {
      setShowConfirmError(true);
    }
  };

  const { loading, run } = useScopedLoading();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token?.trim()) {
      toast.error("Token không hợp lệ");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setShowPasswordError(true);
      return;
    } else {
      setShowPasswordError(false);
    }

    if (newPassword !== confirmPassword) {
      setShowConfirmError(true);
      return;
    } else {
      setShowConfirmError(false);
    }

    //toast
    sonnerToast.dismiss("reset-password-error");

    try {
      const res = await run(() =>
        authApi.resetPassword({
          token,
          newPassword,
          confirmPassword,
        }),
      );

      toast.success(res.message || "Đặt lại mật khẩu thành công");

      navigate("/login", {
        state: { message: res.message || "Đặt lại mật khẩu thành công" },
      });
    } catch (error) {
      sonnerToast.error(getErrorMessage(error, "Có lỗi xảy ra, thử lại sau"), {
        id: "reset-password-error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center">Đặt lại mật khẩu</h2>

        {/* Password */}
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Mật khẩu mới"
            className="h-11"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />

          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              showPasswordError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            Mật khẩu phải có chữ hoa, chữ thường và số
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="h-11"
            value={confirmPassword}
            onChange={(e) => handleConfirmChange(e.target.value)}
          />

          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              showConfirmError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            Mật khẩu không khớp
          </p>
        </div>

        <div className="flex justify-center">
          <AsyncButton
            loading={loading}
            type="submit"
            className="px-6 py-5"
            loadingText="Đang xử lý"
          >
            Xác nhận
          </AsyncButton>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
