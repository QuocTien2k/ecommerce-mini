import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { sonnerToast } from "@/lib/sonner-toast";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useToggleWishlist } from "../hooks/useCustomerWishlist";
import { getErrorMessage } from "@lib/error-message";
import { AsyncButton } from "@components/common/async-button";

type Props = {
  productId: string;
  isWishlisted: boolean;
  className?: string;
};

export function WishlistButton({ productId, isWishlisted, className }: Props) {
  const { loading, run } = useScopedLoading();

  const toggleWishlistMutation = useToggleWishlist();

  const handleToggleWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    sonnerToast.dismiss("wishlist-toggle-error");

    try {
      const result = await run(() =>
        toggleWishlistMutation.mutateAsync(productId),
      );

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Toggle wishlist error:", error);

      sonnerToast.error(
        getErrorMessage(error, "Cập nhật danh sách yêu thích thất bại"),
        {
          id: "wishlist-toggle-error",
        },
      );
    }
  };

  return (
    <AsyncButton
      type="button"
      variant="ghost"
      size="icon"
      loading={loading}
      showLoadingText={false}
      onClick={handleToggleWishlist}
      className={cn("rounded-full", className)}
      aria-label={
        isWishlisted
          ? "Xóa khỏi danh sách yêu thích"
          : "Thêm vào danh sách yêu thích"
      }
    >
      <Heart
        className={cn(
          "size-5 transition-colors",
          isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground",
        )}
      />
    </AsyncButton>
  );
}
