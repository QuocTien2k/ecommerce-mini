import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductSearchPreviewQuery } from "../hooks/useProductSearch";
import { formatCurrency } from "@lib/format-currency";
import { ProductNotFound } from "@components/product/ProductNotFound";
import { Spinner } from "@components/ui/spinner";

export const ProductSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setKeyword(search);
  }, [search]);

  //path đổi đóng dropdown
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  //click ra ngoài đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading } = useProductSearchPreviewQuery(debouncedKeyword);

  const previewProducts = data?.data.data ?? [];

  const handleSearch = () => {
    const value = keyword.trim();

    setIsOpen(false);

    navigate(
      value ? `/products?search=${encodeURIComponent(value)}` : "/products",
    );
  };

  const showDropdown = isOpen && debouncedKeyword.trim().length >= 2;

  const handleProductClick = (slug: string) => {
    setKeyword("");
    setIsOpen(false);
    navigate(`/products/${slug}`);
  };

  //console.log("Preview Products", previewProducts);

  return (
    <div ref={wrapperRef} className="relative">
      <Search
        onClick={handleSearch}
        className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
      />

      <Input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Tìm kiếm sản phẩm..."
        className="pl-10"
      />

      {showDropdown && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border bg-background shadow-xl">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Spinner size="sm" label="Đang tìm kiếm..." />
            </div>
          ) : previewProducts.length > 0 ? (
            <>
              <div className="divide-y">
                {previewProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductClick(product.slug)}
                    className="
                    group flex w-full items-center gap-4 cursor-pointer
                    px-4 py-3.5 text-left
                    transition-colors duration-150
                    hover:bg-orange-50
                  "
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="h-14 w-14 shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium transition-colorsgroup-hover:text-orange-600">
                        {product.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-sm font-semibold text-red-500">
                              {formatCurrency(product.discountPrice)}
                            </span>

                            <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="cursor-pointer w-full border-t px-4 py-3 text-center text-sm font-medium transition-colors duration-150 hover:bg-orange-50"
              >
                Xem tất cả kết quả
              </button>
            </>
          ) : (
            <ProductNotFound />
          )}
        </div>
      )}
    </div>
  );
};
