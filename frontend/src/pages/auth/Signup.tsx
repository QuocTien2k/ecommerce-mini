import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { Input } from "@components/ui/input";
import { authApi } from "@features/auth/auth.api";
import type { SignupFormValues } from "@features/auth/signup/signup.schema";
import { useSignupForm } from "@features/auth/signup/useSignupForm";
import { getErrorMessage } from "@lib/error";
import { sonnerToast } from "@lib/sonner-toast";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { loading, run } = useScopedLoading();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted },
  } = useSignupForm();

  const getErrorVisibility = (field: keyof SignupFormValues) =>
    errors[field] && (dirtyFields[field] || isSubmitted);

  const onSubmit = async (values: SignupFormValues) => {
    sonnerToast.dismiss("signup-error");

    try {
      await run(
        async () => {
          const { confirmPassword, ...payload } = values;

          await authApi.signup(payload);

          return true;
        },
        { minDuration: 600 },
      );

      navigate("/login", {
        state: {
          message: "Đăng ký thành công",
          type: "success",
        },
      });
    } catch (error) {
      console.log("Signup error:", error);

      sonnerToast.error(getErrorMessage(error, "Đăng ký thất bại"), {
        id: "signup-error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center">Đăng ký</h2>

        {/* Email */}
        <div className="space-y-2">
          <Input placeholder="Email" {...register("email")} className="h-11" />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              getErrorVisibility("email")
                ? "max-h-10 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {getErrorVisibility("email") ? errors.email?.message : ""}
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Input
            placeholder="Số điện thoại"
            {...register("phone")}
            className="h-11"
          />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              getErrorVisibility("phone")
                ? "max-h-10 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {getErrorVisibility("phone") ? errors.phone?.message : ""}
          </p>
        </div>

        {/* Fullname */}
        <div className="space-y-2">
          <Input
            placeholder="Họ và tên"
            {...register("fullname")}
            className="h-11"
          />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              getErrorVisibility("fullname")
                ? "max-h-10 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {getErrorVisibility("fullname") ? errors.fullname?.message : ""}
          </p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="h-11"
          />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              getErrorVisibility("password")
                ? "max-h-10 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {getErrorVisibility("password") ? errors.password?.message : ""}
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Xác nhận mật khẩu"
            {...register("confirmPassword")}
            className="h-11"
          />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              getErrorVisibility("confirmPassword")
                ? "max-h-10 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {getErrorVisibility("confirmPassword")
              ? errors.confirmPassword?.message
              : ""}
          </p>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Input
            placeholder="Địa chỉ"
            {...register("address")}
            className="h-11"
          />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              getErrorVisibility("address")
                ? "max-h-10 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {getErrorVisibility("address") ? errors.address?.message : ""}
          </p>
        </div>

        <div className="flex justify-center">
          <AsyncButton
            loading={loading}
            type="submit"
            className="px-6 py-5"
            loadingText="Đang đăng ký"
          >
            Đăng ký
          </AsyncButton>
        </div>

        <div className="flex justify-center text-sm">
          <Link to="/login" className="text-muted-foreground hover:underline">
            Đã có tài khoản?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
