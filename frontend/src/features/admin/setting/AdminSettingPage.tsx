import { Button } from "@components/ui/button";
import { Title } from "@components/ui/title-module";
import { useState } from "react";
import { useGetSetting } from "@/domains/setting/hooks/useSetting";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import AdminSettingCard from "./components/AdminSettingCard";
import { isNotFoundError } from "@lib/error-message";
import AdminSettingDialog from "./components/AdminSettingDialog";

const AdminSettingPage = () => {
  const [mode, setMode] = useState<"create" | "update" | null>(null);
  const { data: setting, isLoading, error } = useGetSetting();
  const isNotFound = isNotFoundError(error);

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý cấu hình" />

          <Button onClick={() => setMode(isNotFound ? "create" : "update")}>
            {isNotFound ? "Tạo cấu hình" : "Chỉnh sửa"}
          </Button>
        </div>
        {setting && <AdminSettingCard setting={setting} />}
      </div>
      <AdminSettingDialog
        open={mode !== null}
        mode={mode ?? "create"}
        setting={setting}
        onClose={() => setMode(null)}
      />
    </QueryStateWrapper>
  );
};

export default AdminSettingPage;
