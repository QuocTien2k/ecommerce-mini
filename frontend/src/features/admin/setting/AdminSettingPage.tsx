import { Button } from "@components/ui/button";
import { Title } from "@components/ui/title-module";
import { useState } from "react";
import AdminCreateSetting from "./components/AdminCreateSetting";

const AdminSettingPage = () => {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý cấu hình" />

          <Button onClick={() => setOpenCreate(true)}>Tạo cấu hình</Button>
        </div>
      </div>
      <AdminCreateSetting
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </>
  );
};

export default AdminSettingPage;
