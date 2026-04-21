import ForbiddenPage from "@pages/error/ForbiddenPage";
import NotFoundPage from "@pages/error/NotFoundPage";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Error pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
