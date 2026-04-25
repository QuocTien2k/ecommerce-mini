import { authApi } from "@features/auth/auth.api";
import { setCredentials } from "@features/auth/auth.slice";
import { useLoginForm } from "@features/auth/login/useLoginForm";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const res = await authApi.login(data.email, data.password);
      const accessToken = res.accessToken;

      dispatch(setCredentials({ accessToken, role: null }));

      const me = await authApi.getMe();

      dispatch(
        setCredentials({
          accessToken,
          role: me.role,
        }),
      );

      if (me.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.log("Login error:", err.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center">Đăng nhập</h2>

        <div className="space-y-2">
          <Input placeholder="Email" {...register("email")} className="h-11" />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              errors.email ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {errors.email?.message as string}
          </p>
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="h-11"
          />
          <p
            className={`text-sm text-red-500 transition-all duration-200 ${
              errors.password ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {errors.password?.message as string}
          </p>
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="px-6 py-5">
            Đăng nhập
          </Button>
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
