import MainLayout from "@/layouts/MainLayout";
import ForbiddenPage from "@pages/error/ForbiddenPage";
import NotFoundPage from "@pages/error/NotFoundPage";
import Home from "@pages/home/Home";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Error pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
