import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md p-6 bg-background rounded-2xl shadow">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
