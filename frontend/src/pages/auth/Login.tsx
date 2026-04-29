import { authApi } from "@features/auth/auth.api";
import { setCredentials } from "@features/auth/auth.slice";
import { useLoginForm } from "@features/auth/login/useLoginForm";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import type { LoginFormValues } from "@features/auth/login/login.schema";
import { Role } from "@/types/role";
import { useAppDispatch } from "@app/hooks";
import { getErrorMessage } from "@lib/error";
import { sonnerToast } from "@lib/sonner-toast";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { useFlashMessage } from "@/hooks/flash-message";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, run } = useScopedLoading();
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted },
  } = useLoginForm();

  useFlashMessage();

  const showEmailError = errors.email && (dirtyFields.email || isSubmitted);
  const showPasswordError =
    errors.password && (dirtyFields.password || isSubmitted);

  const onSubmit = async (data: LoginFormValues) => {
    //toast
    sonnerToast.dismiss("login-error");
    try {
      const user = await run(
        async () => {
          const res = await authApi.login(data.email, data.password);
          const accessToken = res.accessToken;

          dispatch(setCredentials({ accessToken, role: null }));

          const profile = await authApi.getMe();

          dispatch(
            setCredentials({
              accessToken,
              role: profile.role,
            }),
          );

          localStorage.setItem("hasAuthHint", "true");

          return profile;
        },
        { minDuration: 600 },
      );

      navigate(user.role === Role.ADMIN ? "/admin" : "/");
    } catch (error) {
      console.log("Login error:", error);
      sonnerToast.error(getErrorMessage(error, "Đăng nhập thất bại"), {
        id: "login-error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center">Đăng nhập</h2>

        {/*Email*/}
        <div className="space-y-2">
          <Input placeholder="Email" {...register("email")} className="h-11" />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              showEmailError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {showEmailError ? errors.email?.message : ""}
          </p>
        </div>

        {/*Password*/}
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="h-11"
          />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              showPasswordError ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {showPasswordError ? errors.password?.message : ""}
          </p>
        </div>

        <div className="flex justify-center">
          <AsyncButton
            loading={loading}
            type="submit"
            className="px-6 py-5"
            loadingText="Đang đăng nhập"
          >
            Đăng nhập
          </AsyncButton>
        </div>

        <div className="flex justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-muted-foreground hover:underline"
          >
            Quên mật khẩu?
          </Link>

          <Link to="/signup" className="text-muted-foreground hover:underline">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
