import { useState } from "react";
import { useAdminProductFilter } from "./hooks/useAdminProductFilter";
import { useAdminProductsQuery } from "./hooks/useAdminProductQuery";
import type { AdminProductListItem } from "./types/admin-product.type";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Title } from "@components/ui/title-module";
import { Button } from "@components/ui/button";
import AdminProductFilter from "./components/AdminProductFilter";
import type { FlatCategoryItem } from "@features/admin/categories/types/admin-category.type";
import AppPagination from "@components/common/pagination";
import { useAdminFlatCategoriesQuery } from "@features/admin/categories/hooks/useAdminCategoryFlatQuery";
import { cn } from "@lib/utils";
import { Badge } from "@components/ui/badge";
import CopyableText from "@components/common/copyable-text";
import { format } from "date-fns";
import { AsyncButton } from "@components/common/async-button";
import { Eye, RotateCcw, Trash2 } from "lucide-react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { sonnerToast } from "@lib/sonner-toast";
import { CreateProductForm } from "./components/AdminCreateProduct";
import { Link } from "react-router-dom";
import AdminUpdateProduct from "./components/AdminUpdateProduct";
import type { AdminBrandItem } from "@features/admin/brands/types/admin-brand.type";
import { useAdminBrandQuery } from "@features/admin/brands/hooks/useAdminBrandQuery";
import { useAdminStatusMutation } from "./hooks/useAdminStatusMutation";
import { getErrorMessage } from "@lib/error";
import { getCategoryDisplayName } from "@/utils/category/category-display-name";
import { FALLBACK_IMAGE } from "@shared/constants/image";

type PendingAction = "update" | "delete" | "restore" | null;

const AdminProductPage = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { page, setPage, filters, filterActions, queryParams, resetFilters } =
    useAdminProductFilter();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<AdminProductListItem | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const { loading, run } = useScopedLoading();

  const { data, isLoading, isFetching } = useAdminProductsQuery(queryParams);
  const { data: flatData } = useAdminFlatCategoriesQuery();
  const { data: brandsQuery } = useAdminBrandQuery();
  const { mutateAsync } = useAdminStatusMutation();

  const products: AdminProductListItem[] = data?.data?.data ?? [];
  const flatCategories: FlatCategoryItem[] = flatData?.data ?? [];
  const brands: AdminBrandItem[] = brandsQuery?.data?.data ?? [];

  const meta = data?.data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  const handleProductLifecycle = async (
    productId: string,
    action: Exclude<PendingAction, "update" | null>,
  ) => {
    if (pendingId) return;

    sonnerToast.dismiss("category-status-error");

    setPendingId(productId);
    setPendingAction(action);

    try {
      const result = await run(
        () =>
          mutateAsync({
            productId,
            action,
          }),
        {
          minDuration: 500,
        },
      );

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Toggle product status error:", error);

      sonnerToast.error(
        getErrorMessage(error, "Thay đổi trạng thái thất bại"),
        {
          id: "product-status-error",
        },
      );
    } finally {
      setPendingId(null);
      setPendingAction(null);
    }
  };

  console.log("Data trả về: ", products);

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý sản phẩm" />

          <span className="text-sm text-muted-foreground">
            Tổng số sản phẩm: {meta?.total ?? 0}
          </span>
          <Button onClick={() => setOpenCreate(true)}>Tạo sản phẩm</Button>
        </div>

        {/* Filters */}
        <AdminProductFilter
          filters={filters}
          actions={filterActions}
          flatCategories={flatCategories}
          brands={brands}
          onReset={resetFilters}
        />

        {/* Table */}
        <div
          className={cn(
            "border rounded-xl overflow-hidden transition-opacity",
            {
              "opacity-60": isFetching,
            },
          )}
        >
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left hover:bg-muted/40 transition-colors">
                <th className="px-4 py-3 font-medium">Ảnh</th>

                <th className="px-4 py-3 font-medium">Tên sản phẩm</th>

                <th className="px-4 py-3 font-medium">Danh mục</th>

                <th className="px-4 py-3 font-medium">Giá</th>

                <th className="px-4 py-3 font-medium">Giảm giá</th>

                <th className="px-4 py-3 font-medium">Đánh giá</th>

                <th className="px-4 py-3 font-medium">Trạng thái</th>

                <th className="px-4 py-3 font-medium">Ngày tạo</th>

                <th className="px-4 py-3 text-center font-medium w-40">
                  Hành động
                </th>
                <th className="px-4 py-3 font-medium">Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const category = flatCategories.find(
                  (item) => item.id === product.categoryId,
                );

                return (
                  <tr
                    key={product.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {/* THUMBNAIL */}
                    <td className="px-4 py-3">
                      <div className="w-14 h-14 rounded-md overflow-hidden border bg-muted">
                        <img
                          src={product.thumbnail || FALLBACK_IMAGE}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </td>

                    {/* NAME */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium truncate max-w-60">
                          {product.name}
                        </span>

                        <Badge
                          variant="secondary"
                          className="w-fit font-mono text-[11px] tracking-wide"
                        >
                          /{product.slug}
                        </Badge>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-3">
                      {category ? (
                        <CopyableText
                          value={getCategoryDisplayName(category.name)}
                          className="
                  px-2 py-1
                  font-sans text-sm font-semibold
                  text-primary
                  hover:text-primary
                "
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Không có
                        </span>
                      )}
                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-3 font-medium">
                      {Number(product.price).toLocaleString("vi-VN")}đ
                    </td>

                    {/* DISCOUNT */}
                    <td className="px-4 py-3">
                      {product.discountPct ? (
                        <Badge variant="destructive">
                          -{product.discountPct}%
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Không có
                        </span>
                      )}
                    </td>

                    {/* RATING */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {product.ratingAvg ?? 0}/5
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {product.ratingCount} đánh giá
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      {product.deletedAt ? (
                        <Badge variant="destructive">Đã xóa</Badge>
                      ) : product.isActive ? (
                        <Badge className="bg-violet-100 text-violet-700 border border-violet-200 hover:bg-violet-100">
                          Đang hoạt động
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-100">
                          Tạm khóa
                        </Badge>
                      )}
                    </td>

                    {/* CREATED AT */}
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {format(new Date(product.createdAt), "dd/MM/yyyy")}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <AsyncButton
                          size="sm"
                          variant="edit"
                          disabled={loading || isFetching}
                          loading={
                            loading &&
                            pendingId === product.id &&
                            pendingAction === "update"
                          }
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenUpdate(true);
                          }}
                        >
                          Cập nhật
                        </AsyncButton>

                        <AsyncButton
                          size="icon"
                          showLoadingText={false}
                          disabled={loading || isFetching}
                          loading={
                            loading &&
                            pendingId === product.id &&
                            (pendingAction === "delete" ||
                              pendingAction === "restore")
                          }
                          variant={
                            product.deletedAt ? "secondary" : "destructive"
                          }
                          onClick={() =>
                            handleProductLifecycle(
                              product.id,
                              product.deletedAt ? "restore" : "delete",
                            )
                          }
                        >
                          {product.deletedAt ? (
                            <RotateCcw className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </AsyncButton>
                      </div>
                    </td>

                    {/* DETAIL*/}
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="
      inline-flex items-center justify-center
      w-9 h-9
      rounded-lg
      hover:bg-gray-100
      text-gray-600 hover:text-blue-600
      transition
    "
                        title="Chi tiết sản phẩm"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY */}
              {products.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10">
                    <span className="text-sm text-muted-foreground">
                      Không tìm thấy sản phẩm
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <AppPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Create */}
      <CreateProductForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <AdminUpdateProduct
        open={openUpdate}
        onOpenChange={(value) => {
          setOpenUpdate(value);

          if (!value) {
            setSelectedProduct(null);
          }
        }}
        product={selectedProduct}
      />
    </QueryStateWrapper>
  );
};

export default AdminProductPage;
