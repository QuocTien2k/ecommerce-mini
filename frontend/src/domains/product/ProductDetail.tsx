import { useParams } from "react-router-dom";
import { usePublicProductDetail } from "./hooks/useProductDetail";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import {
  buildVariantOptions,
  findVariantBySelection,
  getDefaultVariantSelection,
} from "./utils/buildVariantOptions";
import { useEffect, useMemo, useState } from "react";
import { ProductNotFound } from "@components/product/ProductNotFound";
import { FALLBACK_IMAGE } from "@shared/constants/image";
import { formatCurrency } from "@lib/format-currency";
import { ATTRIBUTE_LABELS } from "@shared/types/variant-type";
import { SectionTitle } from "@components/ui/section-title";
import { QuantitySelector } from "@components/product/QuantitySelector";
import { Separator } from "@components/ui/separator";
import TiptapContent from "@components/editor/TiptapContent";
import { AsyncButton } from "@components/common/async-button";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@features/customer/cart/hooks/useAddToCart";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { toast } from "sonner";
import { useAppSelector } from "@app/hooks";
import ProductRating from "@features/customer/rating/components/ProductRating";

const ProductDetail = () => {
  //check auth
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = Boolean(user?.id);

  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = usePublicProductDetail(slug ?? "");
  const { loading, run } = useScopedLoading();

  const addToCartMutation = useAddToCart();

  const [selectedImage, setSelectedImage] = useState<string>();

  const [selectedColor, setSelectedColor] = useState<string>();

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const [quantity, setQuantity] = useState(1);

  const options = useMemo(() => {
    if (!product) {
      return {
        colors: [],
        attributes: {},
      };
    }

    return buildVariantOptions(product.variants);
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;

    return findVariantBySelection(
      product.variants,
      selectedColor,
      selectedAttributes,
    );
  }, [product, selectedColor, selectedAttributes]);

  //lấy tất cả ảnh
  const allImages = useMemo(() => {
    if (!product) return [];

    return [
      product.thumbnail,
      ...product.variants.flatMap((variant) => variant.images),
    ].filter((image, index, images) => images.indexOf(image) === index);
  }, [product]);

  // Khởi tạo variant mặc định khi product thay đổi
  useEffect(() => {
    if (!product) return;

    const defaultSelection = getDefaultVariantSelection(product.variants);

    setSelectedColor(defaultSelection.color);

    setSelectedAttributes(defaultSelection.attributes);
  }, [product]);

  //chọn image mặc định
  useEffect(() => {
    if (selectedVariant?.images?.length) {
      setSelectedImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

  if (!product) {
    return (
      <QueryStateWrapper isLoading={isLoading}>
        <ProductNotFound />
      </QueryStateWrapper>
    );
  }

  const isOutOfStock = (selectedVariant?.stock ?? 0) <= 0;

  const handleAddToCart = async () => {
    if (!selectedVariant || loading) return;

    try {
      await run(
        () =>
          addToCartMutation.mutateAsync({
            variantId: selectedVariant.id,
            quantity,
          }),
        {
          minDuration: 500,
        },
      );

      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      sonnerToast.error(
        getErrorMessage(error, "Thêm sản phẩm vào giỏ hàng thất bại"),
      );
    }
  };

  //console.log("Product: ", product.variants);

  const hasDiscount = product.discountPrice != null;

  return (
    <QueryStateWrapper isLoading={isLoading}>
      {/* Title */}
      <div className="">
        <SectionTitle title="Chi tiết sản phẩm" description="" />
      </div>
      <div className="container mx-auto py-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Side - Image*/}
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="h-125 w-full">
              <img
                src={selectedImage ?? product.thumbnail ?? FALLBACK_IMAGE}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            <div className="mt-4 flex gap-4 p-2">
              {allImages.map((image) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded border cursor-pointer ${
                    selectedImage === image
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Info*/}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>

            {/* Category */}
            <div className="flex items-center gap-6">
              <p className="text-lg font-semibold text-gray-900">Danh mục:</p>

              <span className="text-lg text-gray-700">
                {product.category.name}
              </span>
            </div>
            <Separator />

            {/* Rating */}
            <div className="flex items-center gap-6">
              <p className="text-lg font-semibold text-gray-900">Đánh giá: </p>

              <div className="flex items-center gap-2  text-gray-600">
                <span>⭐ {product.ratingAvg}</span>
                <span>({product.ratingCount} đánh giá)</span>
              </div>
            </div>
            {isAuthenticated && <ProductRating productId={product.id} />}
            <Separator />

            {/* Attributes */}
            {Object.entries(options.attributes).map(
              ([attributeKey, values]) => (
                <div key={attributeKey}>
                  <p className="mb-2 text-lg font-semibold text-gray-900">
                    {ATTRIBUTE_LABELS[attributeKey] ?? attributeKey}:
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {values.map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setSelectedAttributes((prev) => ({
                            ...prev,
                            [attributeKey]: value,
                          }))
                        }
                        className={`rounded-md px-4 cursor-pointer py-2 text-sm transition-colors duration-200
${
  selectedAttributes[attributeKey] === value
    ? "bg-gray-100 text-gray-900"
    : "text-gray-600 hover:bg-gray-100"
}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )}

            <Separator />
            {/* Colors */}
            <div>
              <p className="mb-3 text-lg font-semibold text-gray-900">
                Màu sắc:
              </p>
              <div className="flex flex-wrap gap-2">
                {options.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-md border px-4 py-2 text-sm transition-colors cursor-pointer duration-200
    ${selectedColor === color ? "border-black bg-black text-white" : "border-transparent text-gray-700 hover:bg-gray-100"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <span className="font-medium text-gray-900">Đã chọn:</span>

                <span className="text-gray-600">
                  {" "}
                  {selectedColor}
                  {Object.values(selectedAttributes).length > 0 &&
                    ` / ${Object.values(selectedAttributes).join(" / ")}`}
                </span>
              </div>
            </div>
            <Separator />

            {/* Price */}
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold text-gray-900">Giá tiền:</p>

              {hasDiscount ? (
                <>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(product.discountPrice)}
                  </p>

                  <span className="rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                    -{product.discountPct}%
                  </span>

                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>
            <Separator />

            {/* Quantity */}
            <div className="flex items-center gap-6">
              <span className="text-lg font-medium text-gray-500">
                Số lượng
              </span>

              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={selectedVariant?.stock ?? 0}
                size="md"
              />
            </div>

            {/* Actions */}
            <div className="pt-2">
              <AsyncButton
                size={"lg"}
                loading={loading}
                disabled={loading || isOutOfStock}
                onClick={handleAddToCart}
                className="h-12 px-6 text-lg font-semibold inline-flex items-center gap-2"
              >
                <ShoppingCart className="size-5" />
                {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </AsyncButton>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        {/* Description */}
        <div className="space-y-4">
          <SectionTitle title="Mô tả sản phẩm" description="" />

          <div className="max-w-full rounded-lg shadow-sm bg-background p-6 text-foreground">
            <TiptapContent content={product.description} />
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default ProductDetail;
