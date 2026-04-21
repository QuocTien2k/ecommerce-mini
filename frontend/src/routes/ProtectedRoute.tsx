import { useAppSelector } from "@app/hooks";
import { Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div>ProtectedRoute</div>;
};

export default ProtectedRoute;
