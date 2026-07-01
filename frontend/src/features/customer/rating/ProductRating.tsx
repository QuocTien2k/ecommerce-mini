import { Star } from "lucide-react";
import { useCreateRating } from "./hooks/useCreateRating";
import { useState } from "react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { cn } from "@lib/utils";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { useUpdateRating } from "./hooks/useUpdateRating";
import { CUSTOMER_RATING_QUERY_KEY } from "./constant/rating-query-key.contants";
import type { Rating } from "./types/customerRating.type";
import { useQueryClient } from "@tanstack/react-query";

type ProductRatingProps = {
  productId: string;
};

const ProductRating = ({ productId }: ProductRatingProps) => {
  const queryClient = useQueryClient();

  const myRating = queryClient.getQueryData<Rating | null>(
    CUSTOMER_RATING_QUERY_KEY.mine(productId),
  );

  const { mutateAsync: createRating } = useCreateRating();
  const { mutateAsync: updateRating } = useUpdateRating();

  const { loading, run } = useScopedLoading();

  const [selectedRating, setSelectedRating] = useState(
    () => myRating?.value ?? 0,
  );

  const handleRate = async (value: number) => {
    if (loading) return;

    sonnerToast.dismiss("rating-error");

    const previousValue = selectedRating;

    setSelectedRating(value);

    try {
      const result = await run(async () => {
        const cachedRating = queryClient.getQueryData<Rating | null>(
          CUSTOMER_RATING_QUERY_KEY.mine(productId),
        );

        //create
        if (!cachedRating?.id) {
          return await createRating({
            productId,
            value,
          });
        }

        //update
        return await updateRating({
          productId,
          payload: { value },
        });
      });

      if (result) {
        sonnerToast.success(result.message);

        // IMPORTANT: ensure cache sync (force consistency)
        queryClient.setQueryData(
          CUSTOMER_RATING_QUERY_KEY.mine(productId),
          (old: Rating | null | undefined) => ({
            ...(old ?? {}),
            ...result.data,
          }),
        );
      }
    } catch (error) {
      setSelectedRating(previousValue);

      sonnerToast.error(getErrorMessage(error, "Đánh giá sản phẩm thất bại"), {
        id: "rating-error",
      });
    }
  };

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
      </div>
    </div>
  );
};

export default ProductRating;
