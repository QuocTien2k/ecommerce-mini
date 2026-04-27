import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { authApi } from "@features/auth/auth.api";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setShowPasswordError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setShowConfirmError(true);
      return;
    }

    try {
      const res = await authApi.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      const message = res.message || "Đặt lại mật khẩu thành công";

      toast.success(message);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Có lỗi xảy ra";

      toast.error(message);
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
          <Button type="submit" className="px-6 py-5">
            Xác nhận
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
