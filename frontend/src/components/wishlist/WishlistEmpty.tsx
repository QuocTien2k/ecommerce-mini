import { Button } from "@components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const WishlistEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Heart className="mb-4 size-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">Chưa có sản phẩm yêu thích</h3>

      <p className="my-2 max-w-md text-sm text-muted-foreground">
        Hãy thêm những sản phẩm bạn quan tâm vào danh sách yêu thích để dễ dàng
        xem lại sau.
      </p>

      <Button asChild>
        <Link to="/products">Khám phá sản phẩm</Link>
      </Button>
    </div>
  );
};
