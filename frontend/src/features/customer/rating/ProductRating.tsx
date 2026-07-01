import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { cn } from "@lib/utils";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { useUpsertRating } from "./hooks/useUpsertRating";
import { useGetMyRating } from "./hooks/useGetMyRating";
import { useDeleteRating } from "./hooks/useDeleteRating";
import { AsyncButton } from "@components/common/async-button";

type ProductRatingProps = {
  productId: string;
};

const ProductRating = ({ productId }: ProductRatingProps) => {
  const ratingQuery = useGetMyRating(productId);

  const myRating = ratingQuery.data?.data;

  // console.log({
  //   status: ratingQuery.status,
  //   data: ratingQuery.data,
  //   error: ratingQuery.error,
  //   fetchStatus: ratingQuery.fetchStatus,
  // });

  const { mutateAsync: deleteRating } = useDeleteRating();

  const { mutateAsync: upsertRating } = useUpsertRating();

  const { loading, run } = useScopedLoading();

  const [selectedRating, setSelectedRating] = useState(
    () => myRating?.value ?? 0,
  );

  useEffect(() => {
    setSelectedRating(myRating?.value ?? 0);
  }, [myRating?.value]);

  const handleRate = async (value: number) => {
    if (loading) return;

    sonnerToast.dismiss("rating-error");

    const previousValue = selectedRating;

    setSelectedRating(value);

    try {
      const result = await run(() =>
        upsertRating({
          productId,
          value,
        }),
      );

      if (result) {
        sonnerToast.success(result.message);
      }
    } catch (error) {
      setSelectedRating(previousValue);

      sonnerToast.error(getErrorMessage(error, "Đánh giá sản phẩm thất bại"), {
        id: "rating-error",
      });
    }
  };

  const handleDelete = async () => {
    if (loading || !myRating) return;

    sonnerToast.dismiss("rating-error");

    const previousValue = selectedRating;

    setSelectedRating(0);

    try {
      const result = await run(() => deleteRating(productId));

      if (result) {
        sonnerToast.success(result.message);
      }
    } catch (error) {
      setSelectedRating(previousValue);

      sonnerToast.error(getErrorMessage(error, "Xóa đánh giá thất bại"), {
        id: "rating-error",
      });
    }
  };

  // console.log({
  //   myRating,
  //   selectedRating,
  // });

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div>
        <h3 className="font-medium">Đánh giá của bạn</h3>
        <p className="text-muted-foreground text-sm">
          Hãy chia sẻ mức độ hài lòng của bạn về sản phẩm.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={loading}
            className="cursor-pointer"
            onClick={() => void handleRate(star)}
          >
            <Star
              className={cn(
                "size-7 transition-colors",
                star <= selectedRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        ))}
        {myRating && (
          <AsyncButton
            type="button"
            disabled={loading}
            onClick={() => void handleDelete()}
            variant={"destructive"}
          >
            Xóa đánh giá
          </AsyncButton>
        )}
      </div>
    </div>
  );
};

export default ProductRating;
