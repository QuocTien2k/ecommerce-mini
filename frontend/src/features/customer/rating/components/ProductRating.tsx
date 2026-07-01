import { Star } from "lucide-react";
import { useGetMyRating } from "../hooks/useGetMyRating";
import { useCreateRating } from "../hooks/useCreateRating";
import { useEffect, useState } from "react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { cn } from "@lib/utils";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";

type ProductRatingProps = {
  productId: string;
};

const ProductRating = ({ productId }: ProductRatingProps) => {
  const { data: myRating } = useGetMyRating(productId);

  const { mutateAsync: createRating } = useCreateRating();
  //const { mutateAsync: updateRating } = useUpdateRating();

  const { loading, run } = useScopedLoading();

  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (myRating) {
      setSelectedRating(myRating.value);
    }
  }, [myRating]);

  const handleRate = async (value: number) => {
    if (loading) return;

    setSelectedRating(value);

    sonnerToast.dismiss("rating-error");

    try {
      const result = await run(async () => {
        if (!myRating) {
          return await createRating({
            productId,
            value,
          });
        }

        // return await updateRating({ productId, value });
      });

      if (result) {
        sonnerToast.success(result.message);
      }
    } catch (error) {
      setSelectedRating(myRating?.value ?? 0);

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
