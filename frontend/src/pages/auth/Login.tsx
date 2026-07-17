import { authApi } from "@features/auth/auth.api";
import { setCredentials } from "@features/auth/auth.slice";
import { useLoginForm } from "@features/auth/login/useLoginForm";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import type { LoginFormValues } from "@features/auth/login/login.schema";
import { Role } from "@/types/role";
import { useAppDispatch } from "@app/hooks";
import { getErrorMessage } from "@lib/error-message";
import { sonnerToast } from "@lib/sonner-toast";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { useFlashMessage } from "@/hooks/flash-message";
import { userApi } from "@features/admin/user/api/user.api";
import { setUser } from "@features/admin/user/store/user.slice";
import { GoogleLogin } from "@react-oauth/google";

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

  const loginSuccess = async (accessToken: string) => {
    dispatch(setCredentials({ accessToken, role: null }));

    const profile = await userApi.getMe();

    dispatch(setUser(profile.data));
    dispatch(
      setCredentials({
        accessToken,
        role: profile.data.role,
      }),
    );

    localStorage.setItem("hasAuthHint", "true");

    navigate(profile.data.role === Role.ADMIN ? "/admin" : "/");
  };

  const onSubmit = async (data: LoginFormValues) => {
    //toast
    sonnerToast.dismiss("login-error");
    try {
      await run(
        async () => {
          const res = await authApi.login(data.email, data.password);
          await loginSuccess(res.data.accessToken);
        },
        { minDuration: 600 },
      );
    } catch (error) {
      sonnerToast.error(getErrorMessage(error, "Đăng nhập thất bại"), {
        id: "login-error",
      });
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    sonnerToast.dismiss("login-error");

    try {
      await run(
        async () => {
          const res = await authApi.googleLogin(idToken);
          await loginSuccess(res.data.accessToken);
        },
        { minDuration: 600 },
      );
    } catch (error) {
      sonnerToast.error(
        getErrorMessage(error, "Đăng nhập bằng Google thất bại"),
        {
          id: "login-error",
        },
      );
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

        {/*Login*/}
        <div className="space-y-4">
          <div className="flex justify-center">
            <AsyncButton
              loading={loading}
              type="submit"
              className="h-11 w-full"
              loadingText="Đang đăng nhập"
            >
              Đăng nhập
            </AsyncButton>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              width="320"
              onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) return;

                handleGoogleLogin(credentialResponse.credential);
              }}
              onError={() => {
                sonnerToast.error("Đăng nhập Google thất bại");
              }}
            />
          </div>
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
