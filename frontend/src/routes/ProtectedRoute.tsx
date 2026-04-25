import { useAppSelector } from "@app/hooks";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthInitialized, accessToken } = useAppSelector(
    (state) => state.auth,
  );
  if (!isAuthInitialized) {
    return null;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
