import { authApi } from "@features/auth/auth.api";
import { setCredentials } from "@features/auth/auth.slice";
import { useLoginForm } from "@features/auth/login/useLoginForm";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const { register, handleSubmit } = useLoginForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const res = await authApi.login(data.email, data.password);
      const accessToken = res.accessToken;

      dispatch(setCredentials({ accessToken, role: null }));

      // gọi /me để lấy role
      const me = await authApi.getMe();

      dispatch(
        setCredentials({
          accessToken,
          role: me.role,
        }),
      );

      // test route theo role
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("email")} placeholder="Email" />
      </div>

      <div>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
