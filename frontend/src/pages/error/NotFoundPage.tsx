import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@app/hooks";
import { Role } from "@/types/role";

export default function NotFoundPage() {
  const role = useAppSelector((state) => state.auth.role);

  const homePath = role === Role.ADMIN ? "/admin" : "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-4xl text-center space-y-4">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src="/400.gif"
            alt="404 illustration"
            className="w-full max-w-180 h-auto object-contain"
          />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">404</h1>
          <p className="text-lg text-muted-foreground">
            Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Action */}
        <div>
          <Link to={homePath}>
            <Button size="lg" className="w-full sm:w-auto cursor-pointer">
              Quay về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
