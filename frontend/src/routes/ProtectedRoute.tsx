import { useAppSelector } from "@app/hooks";
import { store } from "@app/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth,
  );
  const auth = useAppSelector((state) => state.auth);
  console.log("ProtectedRoute auth state:", auth);
  store.subscribe(() => {
    console.log("STATE CHANGE:", store.getState().auth);
  });
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
