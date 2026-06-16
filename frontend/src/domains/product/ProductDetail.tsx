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

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = usePublicProductDetail(slug ?? "");

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

  // Khởi tạo variant mặc định khi product thay đổi
  useEffect(() => {
    if (!product) return;

    const defaultSelection = getDefaultVariantSelection(product.variants);

    setSelectedColor(defaultSelection.color);

    setSelectedAttributes(defaultSelection.attributes);
  }, [product]);

  if (!product) {
    return (
      <QueryStateWrapper isLoading={isLoading}>
        <ProductNotFound />
      </QueryStateWrapper>
    );
  }

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="container mx-auto py-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={selectedVariant?.images?.[0] ?? product.thumbnail}
              alt={product.name}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>

            <p className="mt-2 text-gray-600">
              Danh mục: {product.category.name}
            </p>

            {/* Attributes */}
            {Object.entries(options.attributes).map(
              ([attributeKey, values]) => (
                <div key={attributeKey} className="mt-4">
                  <p>{attributeKey}</p>

                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSelectedAttributes((prev) => ({
                          ...prev,
                          [attributeKey]: value,
                        }))
                      }
                    >
                      {value}
                    </button>
                  ))}
                </div>
              ),
            )}

            {/* Colors */}
            <div className="mt-4">
              {options.colors.map((color) => (
                <button key={color} onClick={() => setSelectedColor(color)}>
                  {color}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <p>Giá gốc: {product.price}</p>

              {product.discountPrice && (
                <p>Giá khuyến mãi: {product.discountPrice}</p>
              )}
            </div>

            <div className="mt-4">
              <p>Đánh giá: {product.ratingAvg}</p>
              <p>Lượt đánh giá: {product.ratingCount}</p>
            </div>
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default ProductDetail;
