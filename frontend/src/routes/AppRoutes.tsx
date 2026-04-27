import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import ForgotPassword from "@pages/auth/ForgotPassword";
import Login from "@pages/auth/Login";
import ResetPassword from "@pages/auth/ResetPassword";
import Signup from "@pages/auth/Signup";
import ForbiddenPage from "@pages/error/ForbiddenPage";
import NotFoundPage from "@pages/error/NotFoundPage";
import Home from "@pages/home/Home";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { Role } from "@/types/role";
import AdminDashboard from "@pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Layout */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={[Role.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* thêm các route admin khác */}
          </Route>
        </Route>
      </Route>

      {/* Layout Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Error pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
