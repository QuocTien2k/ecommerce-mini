import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">403</h1>
          <p className="text-lg font-medium">Bạn không có quyền truy cập</p>
          <p className="text-xl text-muted-foreground">
            Tài nguyên này yêu cầu quyền phù hợp. Vui lòng quay về trang chủ
            hoặc đăng nhập bằng tài khoản khác.
          </p>
        </div>

        {/* Action */}
        <div>
          <Button size="lg" variant="ghost" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
