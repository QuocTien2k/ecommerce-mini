import { Link, useParams } from "react-router-dom";
import { useAdminProductDetail } from "./hooks/useAdminProductDetail";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Title } from "@components/ui/title-module";
import { Button } from "@components/ui/button";
import {
  ArrowLeft,
  Package,
  Package2,
  Palette,
  Pencil,
  Percent,
  Ruler,
  Tag,
  User,
} from "lucide-react";
import type { AdminVariantResponse } from "./types/admin-variant.type";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { useState } from "react";
import AdminCreateVariant from "./components/AdminCreateVariant";
import AdminUpdateVariant from "./components/AdminUpdateVariant";
//import { AdminUpdateVariant } from "./components/AdminUpdateVariant";

const AdminProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching } = useAdminProductDetail(id!);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<AdminVariantResponse | null>(null);

  const getStockColor = (stock: number) => {
    if (stock < 5) {
      return "text-red-500";
    }

    if (stock < 20) {
      return "text-yellow-500";
    }

    return "text-green-600";
  };

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      {!data ? (
        <div className="flex h-75 items-center justify-center rounded-xl border">
          <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Title title="Chi tiết sản phẩm" />

                <p className="text-muted-foreground mt-1 text-sm">
                  Quản lý thông tin và variants của sản phẩm
                </p>
              </div>

              <Button variant="default" asChild>
                <Link to="/admin/products">
                  <ArrowLeft className="mr-2 size-4" />
                  Quay lại
                </Link>
              </Button>
            </div>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Package className="size-5" />
                  {data.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {data.description}
                </p>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="size-4" />
                      Danh mục
                    </div>

                    <p className="font-medium">{data.category.name}</p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="mb-2 text-sm text-muted-foreground">
                      Giá bán
                    </div>

                    <p className="text-xl font-bold">
                      {Number(data.price).toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Percent className="size-4" />
                      Giảm giá
                    </div>

                    <p className="font-medium">{data.discountPct ?? 0}%</p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="size-4" />
                      Người tạo
                    </div>

                    <p className="font-medium">{data.creator.fullname}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Trạng thái:</span>

                  <Badge variant={data.isActive ? "default" : "secondary"}>
                    {data.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Section Divider */}
            <div className="relative py-3">
              <div className="h-2 w-full rounded-full bg-linear-to-r from-transparent via-stone-300 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-stone-300 bg-stone-100 px-5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-stone-700 shadow-sm">
                  Variants
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">Chi tiết</h2>

                  <Badge className="rounded-md border-0 bg-stone-900 px-3 py-1 text-sm font-bold tracking-wide text-stone-100">
                    {data.variants.length} variants
                  </Badge>
                </div>

                <Button onClick={() => setOpenCreate(true)}>
                  Tạo chi tiết sản phẩm
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {data.variants.map((variant: AdminVariantResponse) => (
                  <Card
                    key={variant.id}
                    className="group flex h-full flex-col overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardHeader className="space-y-4 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-muted-foreground" />

                            <p className="truncate text-lg font-semibold tracking-tight">
                              <span className="mr-1 text-sm font-medium text-muted-foreground">
                                Màu:
                              </span>

                              <span className="font-bold underline decoration-2 underline-offset-4">
                                {variant.color}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-muted-foreground" />

                            <p className="text-base font-medium">
                              <span className="mr-1 text-sm font-medium text-muted-foreground">
                                Size:
                              </span>

                              <span className="font-semibold">
                                {variant.attributes?.size ?? "-"}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Package2 className="h-4 w-4 text-muted-foreground" />

                            <p
                              className={`text-base font-semibold ${getStockColor(
                                variant.stock,
                              )}`}
                            >
                              <span className="mr-1 text-sm font-medium text-muted-foreground">
                                Tồn kho:
                              </span>

                              <span className="font-bold">
                                {variant.stock} sản phẩm
                              </span>
                            </p>
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setSelectedVariant(variant)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {variant.images.slice(0, 2).map((img: string) => (
                          <div
                            key={img}
                            className="overflow-hidden rounded-xl border bg-muted"
                          >
                            <img
                              src={img}
                              alt={variant.color}
                              className="aspect-3/4 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {selectedVariant && (
                  <AdminUpdateVariant
                    open={!!selectedVariant}
                    onClose={() => setSelectedVariant(null)}
                    productId={id!}
                    variant={selectedVariant}
                  />
                )}
              </div>
            </div>
          </div>

          <AdminCreateVariant
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            productId={id!}
          />
        </>
      )}
    </QueryStateWrapper>
  );
};

export default AdminProductDetail;
