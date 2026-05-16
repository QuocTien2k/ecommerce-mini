import { Link, useParams } from "react-router-dom";
import { useAdminProductDetail } from "./hooks/useAdminProductDetail";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Title } from "@components/ui/title-module";
import { Button } from "@components/ui/button";
import { ArrowLeft, Package, Percent, Tag, User } from "lucide-react";
import type { AdminProductVariant } from "./types/admin-variant.type";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";

const AdminProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching } = useAdminProductDetail(id!);

  //console.log(data?.variants.map((variant) => variant.attributes));

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      {!data ? (
        <div className="flex h-75 items-center justify-center rounded-xl border">
          <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Title title="Chi tiết sản phẩm" />

              <p className="text-muted-foreground mt-1 text-sm">
                Quản lý thông tin và variants của sản phẩm
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/products">
                  <ArrowLeft className="mr-2 size-4" />
                  Quay lại
                </Link>
              </Button>

              <Button>Cập nhật sản phẩm</Button>
            </div>
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

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Chi tiết</h2>

              <Badge variant="outline">{data.variants.length} variants</Badge>
            </div>

            <div className="grid gap-4">
              {data.variants.map((variant: AdminProductVariant) => (
                <Card key={variant.id}>
                  <CardContent className="space-y-5 pt-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Màu sắc</p>

                        <p className="font-medium">{variant.color}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>

                        <p className="font-medium">
                          {variant.attributes?.size ?? "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Số lượng
                        </p>

                        <p className="font-medium">{variant.stock}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium">Hình ảnh</p>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
                        {variant.images.map((img: string) => (
                          <div
                            key={img}
                            className="overflow-hidden rounded-xl border bg-muted"
                          >
                            <img
                              src={img}
                              alt={variant.color}
                              className="aspect-3/4 h-full w-full object-cover transition hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </QueryStateWrapper>
  );
};

export default AdminProductDetail;
