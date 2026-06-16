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

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = usePublicProductDetail(slug ?? "");

  const [selectedImage, setSelectedImage] = useState<string>();

  const [selectedColor, setSelectedColor] = useState<string>();

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

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

  const hasDiscount = product.discountPrice != null;

  return (
    <QueryStateWrapper isLoading={isLoading}>
      {/* Title */}
      <div className="">
        <SectionTitle title="Chi tiết sản phẩm" description="" />
      </div>
      <div className="container mx-auto py-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Side */}
          <div className="overflow-hidden rounded-lg border">
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

          {/* Right Side */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>

            {/* Category */}
            <div>
              <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {product.category.name}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>⭐ {product.ratingAvg}</span>
              <span>({product.ratingCount} đánh giá)</span>
            </div>

            {/* Attributes */}
            {Object.entries(options.attributes).map(
              ([attributeKey, values]) => (
                <div key={attributeKey}>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    {ATTRIBUTE_LABELS[attributeKey] ?? attributeKey}
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

            {/* Colors */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Màu sắc</p>
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
              <div className="mt-2 text-sm text-gray-600">
                <span>Đang chọn: </span>

                {selectedColor && (
                  <span className="font-medium">{selectedColor}</span>
                )}

                {Object.values(selectedAttributes).length > 0 && (
                  <span>
                    {" / "}
                    {Object.values(selectedAttributes).join(" / ")}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 p-4">
              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-red-600">
                      {formatCurrency(product.discountPrice)}
                    </p>

                    <span className="rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                      -{product.discountPct}%
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-bold">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default ProductDetail;
