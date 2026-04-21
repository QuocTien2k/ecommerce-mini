import { useAppSelector } from "@app/hooks";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

export default function RoleRoute({ allowedRoles }: Props) {
  const { role } = useAppSelector((state) => state.auth);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
