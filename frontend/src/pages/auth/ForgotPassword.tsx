import { useAppDispatch } from "@app/hooks";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { authApi } from "@features/auth/auth.api";
import { getErrorMessage } from "@lib/error";
import { ensureMinDelay } from "@lib/sleep";
import { withLoading } from "@lib/with-loading";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [showEmailError, setShowEmailError] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const dispatch = useAppDispatch();

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

    try {
      await withLoading(dispatch, async () => {
        const start = Date.now();
        const res = await authApi.forgotPassword(email);

        const message = res.message || "Gửi yêu cầu thành công";

        toast.success(message);
        await ensureMinDelay(start, 1800);
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Có lỗi xảy ra, thử lại sau!"));
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
          <Button type="submit" className="px-6 py-5">
            Gửi yêu cầu
          </Button>
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
