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
import AdminUserPage from "@features/admin/user/AdminUserPage";
import AdminCategoryPage from "@features/admin/categories/AdminCategoryPage";
import AdminProductPage from "@features/admin/products/AdminProductPage";
import AdminProductDetail from "@features/admin/products/AdminProductDetail";
import AdminBrandPage from "@features/admin/brands/AdminBrandPage";
import AdminVoucherPage from "@features/admin/vouchers/AdminVoucherPage";
import MyVouchers from "@features/customer/voucher/MyVouchers";
import ProductPage from "@/domains/product/ProductPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Layout */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={[Role.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserPage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="brands" element={<AdminBrandPage />} />
            <Route path="products" element={<AdminProductPage />} />
            <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="vouchers" element={<AdminVoucherPage />} />

            {/* thêm các route admin khác */}
          </Route>
        </Route>
      </Route>

      {/* Layout Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={[Role.USER]} />}>
            <Route path="my-vouchers" element={<MyVouchers />} />
          </Route>
        </Route>
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
