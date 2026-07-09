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
import AdminUserPage from "@features/admin/user/AdminUserPage";
import AdminCategoryPage from "@features/admin/categories/AdminCategoryPage";
import AdminProductPage from "@features/admin/products/AdminProductPage";
import AdminProductDetail from "@features/admin/products/AdminProductDetail";
import AdminBrandPage from "@features/admin/brands/AdminBrandPage";
import AdminVoucherPage from "@features/admin/vouchers/AdminVoucherPage";
import MyVouchers from "@features/customer/voucher/MyVouchers";
import ProductPage from "@/domains/product/ProductPage";
import ProductDetail from "@/domains/product/ProductDetail";
import { CartPage } from "@features/customer/cart/CartPage";
import OrderPage from "@features/customer/order/OrderPage";
import { PaymentReturn } from "@pages/payment/PaymentReturn";
import MyOrders from "@features/customer/order/MyOrders";
import AdminOrderPage from "@features/admin/orders/AdminOrderPage";
import OrderDetail from "@features/customer/order/OrderDetail";
import DashboardPage from "@features/admin/dashboard/DashboardPage";
import AdminSettingPage from "@features/admin/setting/AdminSettingPage";
import MyWishlist from "@features/customer/wishlist/MyWishlist";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Layout */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={[Role.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<AdminUserPage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="brands" element={<AdminBrandPage />} />
            <Route path="products" element={<AdminProductPage />} />
            <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="vouchers" element={<AdminVoucherPage />} />
            <Route path="orders" element={<AdminOrderPage />} />
            <Route path="settings" element={<AdminSettingPage />} />

            {/* thêm các route admin khác */}
          </Route>
        </Route>
      </Route>

      {/* Layout Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/payment/return" element={<PaymentReturn />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={[Role.USER]} />}>
            <Route path="my-vouchers" element={<MyVouchers />} />
            <Route path="my-wishlists" element={<MyWishlist />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="/checkout" element={<OrderPage />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/order/:id" element={<OrderDetail />} />
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
