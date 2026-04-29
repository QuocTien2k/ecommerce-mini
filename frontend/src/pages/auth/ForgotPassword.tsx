import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { Input } from "@components/ui/input";
import { authApi } from "@features/auth/auth.api";
import { getErrorMessage } from "@lib/error";
import { sonnerToast } from "@lib/sonner-toast";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [showEmailError, setShowEmailError] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const { loading, run } = useScopedLoading();

  const handleEmailChange = (value: string) => {
    setEmail(value);

    // reset lỗi khi user bắt đầu sửa
    if (showEmailError) {
      setShowEmailError(false);
    }

    // optional: realtime validation
    if (value && !isValidEmail(value)) {
      setShowEmailError(true);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !isValidEmail(email)) {
      setShowEmailError(true);
      return;
    }

    setShowEmailError(false);

    //toast
    sonnerToast.dismiss("forgot-error");

    try {
      const res = await run(() => authApi.forgotPassword(email));

      toast.success(res.message || "Gửi yêu cầu thành công");
    } catch (error) {
      console.log("Error:", error);
      sonnerToast.error(getErrorMessage(error, "Có lỗi xảy ra, thử lại sau!"), {
        id: "forgot-error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center">Quên mật khẩu</h2>

        {/*Email*/}
        <div className="space-y-2">
          <Input
            placeholder="Email"
            className="h-11"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />

          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              showEmailError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {showEmailError ? "Email không hợp lệ" : ""}
          </p>
        </div>

        <div className="flex justify-center">
          <AsyncButton
            loading={loading}
            type="submit"
            className="px-6 py-5"
            loadingText="Đang gửi"
          >
            Gửi yêu cầu
          </AsyncButton>
        </div>

        <div className="flex justify-between text-sm">
          <Link to="/login" className="text-muted-foreground hover:underline">
            Đăng nhập
          </Link>

          <Link to="/signup" className="text-muted-foreground hover:underline">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
