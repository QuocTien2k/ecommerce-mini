"use client";

import { useDebounce } from "@/hooks/useDebounce";
import AppPagination from "@components/common/pagination";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { useAdminProductsQuery } from "@features/products/hooks/useAdminProductQuery";
import type {
  AdminProductListItem,
  AdminProductListQueryParams,
} from "@features/products/types/admin-product.type";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AdminProductSelectorProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const AdminProductSelector = ({
  value,
  onChange,
}: AdminProductSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [draftIds, setDraftIds] = useState<string[]>(value);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const queryParams = useMemo<AdminProductListQueryParams>(() => {
    return {
      page,
      limit: 10,
      isActive: true,
      ...(debouncedSearch.trim()
        ? {
            search: debouncedSearch.trim(),
          }
        : {}),
    };
  }, [page, debouncedSearch]);

  const { data, isLoading, isFetching } = useAdminProductsQuery(queryParams);

  const products = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const [selectedProducts, setSelectedProducts] = useState<
    AdminProductListItem[]
  >([]);

  useEffect(() => {
    if (products.length === 0) return;

    setSelectedProducts((prev) => {
      const map = new Map(prev.map((product) => [product.id, product]));

      for (const product of products) {
        if (draftIds.includes(product.id)) {
          map.set(product.id, product);
        }
      }

      return Array.from(map.values());
    });
  }, [products, value]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (open) {
      setDraftIds(value);
    }
  }, [open, value]);

  const toggleProduct = (product: AdminProductListItem, checked: boolean) => {
    if (checked) {
      setDraftIds((prev) => [...prev, product.id]);
    } else {
      setDraftIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="text-sm font-medium">Sản phẩm áp dụng</div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              Chọn sản phẩm
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Chọn sản phẩm áp dụng voucher</DialogTitle>

              <DialogDescription>
                Tìm kiếm và chọn sản phẩm muốn áp dụng voucher.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Tìm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="rounded-md border">
                {isLoading || isFetching ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Đang tải sản phẩm...
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Không có sản phẩm
                  </div>
                ) : (
                  <>
                    <div className="divide-y">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            const selected = draftIds.includes(product.id);

                            toggleProduct(product, !selected);
                          }}
                          className={`flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors ${
                            draftIds.includes(product.id)
                              ? "bg-muted"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={draftIds.includes(product.id)}
                              className="pointer-events-none"
                            />

                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {product.name}
                              </div>

                              <div className="text-xs text-muted-foreground">
                                Thương hiệu: {product.brand.name}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm">
                            {Number(product.price).toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDraftIds(value);
                  setOpen(false);
                }}
              >
                Hủy
              </Button>

              <Button
                type="button"
                onClick={() => {
                  onChange(draftIds);

                  setSelectedProducts((prev) => {
                    const currentMap = new Map(
                      prev.map((product) => [product.id, product]),
                    );

                    for (const product of products) {
                      if (draftIds.includes(product.id)) {
                        currentMap.set(product.id, product);
                      }
                    }

                    return Array.from(currentMap.values()).filter((product) =>
                      draftIds.includes(product.id),
                    );
                  });

                  setOpen(false);
                }}
              >
                Xác nhận
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <div className="text-sm font-medium">
          Đã chọn: {value.length} sản phẩm
        </div>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedProducts
              .filter((product) => value.includes(product.id))
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
                >
                  <span className="max-w-55 truncate">{product.name}</span>

                  <button
                    type="button"
                    onClick={() => {
                      onChange(value.filter((id) => id !== product.id));

                      setSelectedProducts((prev) =>
                        prev.filter((item) => item.id !== product.id),
                      );
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <AppPagination
          page={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
