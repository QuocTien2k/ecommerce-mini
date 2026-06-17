import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductSearchPreviewQuery } from "../hooks/useProductSearch";

export const ProductSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [keyword, setKeyword] = useState("");

  const search = searchParams.get("search") || "";

  useEffect(() => {
    setKeyword(search);
  }, [search]);

  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading } = useProductSearchPreviewQuery(debouncedKeyword);

  const previewProducts = data?.data.data ?? [];

  const handleSearch = () => {
    const value = keyword.trim();

    navigate(
      value ? `/products?search=${encodeURIComponent(value)}` : "/products",
    );
  };

  const showDropdown = debouncedKeyword.trim().length >= 2;

  const handleProductClick = (slug: string) => {
    navigate(`/products/${slug}`);
  };

  //console.log("Preview Products", previewProducts);

  return (
    <div className="relative">
      <Search
        onClick={handleSearch}
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
      />

      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Tìm kiếm sản phẩm..."
        className="pl-10"
      />

      {showDropdown && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          {isLoading ? (
            <div className="p-3 text-sm text-muted-foreground">
              Đang tìm kiếm...
            </div>
          ) : previewProducts.length > 0 ? (
            <>
              {previewProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="flex w-full items-center gap-3 border-b p-3 text-left hover:bg-muted"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="size-12 rounded object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {product.price}
                    </p>
                  </div>
                </button>
              ))}

              <button
                type="button"
                className="w-full p-3 text-center text-sm font-medium hover:bg-muted"
                onClick={handleSearch}
              >
                Xem tất cả kết quả
              </button>
            </>
          ) : (
            <div className="p-3 text-sm text-muted-foreground">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>
      )}
    </div>
  );
};
