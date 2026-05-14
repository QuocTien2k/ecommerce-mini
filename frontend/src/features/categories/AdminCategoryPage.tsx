import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useState } from "react";
import { useAdminCategoryFilter } from "./hooks/useAdminCategoryFilter";
import { useAdminCategoriesQuery } from "./hooks/useAdminCategoryQuery";
import { useAdminFlatCategoriesQuery } from "./hooks/useAdminCategoryFlatQuery";
import type {
  AdminCategoryItem,
  FlatCategoryItem,
} from "./types/admin-category.type";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Title } from "@components/ui/title-module";
import { cn } from "@lib/utils";
import AdminCategoryFilter from "./components/AdminCategoryFilter";
import AppPagination from "@components/common/pagination";
import CopyableText from "@components/common/copyable-text";
import { AsyncButton } from "@components/common/async-button";
import { RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@components/ui/badge";
import {
  useRestoreCategoryMutation,
  useSoftDeleteCategoryMutation,
} from "./hooks/useCategoryStatusMutation";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { CreateCategoryForm } from "./components/AdminCreateCategory";
import { format } from "date-fns";
import { UpdateCategoryForm } from "./components/AdminUpdateCategory";

type PendingAction = "update" | "delete" | "restore" | null;

const AdminCategoryPage = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategoryItem | null>(null);
  const { loading, run } = useScopedLoading();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { page, setPage, filters, filterActions, queryParams, resetFilters } =
    useAdminCategoryFilter();

  const { data, isLoading, isFetching } = useAdminCategoriesQuery(queryParams);

  const { data: flatData } = useAdminFlatCategoriesQuery();

  const { mutateAsync: softDeleteCategory } = useSoftDeleteCategoryMutation();

  const { mutateAsync: restoreCategory } = useRestoreCategoryMutation();

  const categories: AdminCategoryItem[] = data?.data?.data ?? [];

  const meta = data?.data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  const flatCategories: FlatCategoryItem[] = flatData?.data ?? [];

  const handleToggleDelete = async (categoryId: string, isDeleted: boolean) => {
    if (pendingId) return;

    sonnerToast.dismiss("category-status-error");

    setPendingId(categoryId);
    setPendingAction(isDeleted ? "restore" : "delete");

    try {
      const result = await run(
        async () => {
          if (isDeleted) {
            return restoreCategory(categoryId);
          }

          return softDeleteCategory(categoryId);
        },
        {
          minDuration: 500,
        },
      );

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Toggle category delete error:", error);

      sonnerToast.error(
        getErrorMessage(error, "Thay đổi trạng thái thất bại"),
        {
          id: "category-status-error",
        },
      );
    } finally {
      setPendingId(null);
      setPendingAction(null);
    }
  };

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý danh mục" />

          <span className="text-sm text-muted-foreground">
            Tổng số danh mục: {meta?.total ?? 0}
          </span>
          <Button onClick={() => setOpenCreate(true)}>Tạo danh mục</Button>
        </div>

        {/* Filters */}
        <AdminCategoryFilter
          filters={filters}
          actions={filterActions}
          flatCategories={flatCategories}
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

                <th className="px-4 py-3 font-medium">Tên danh mục</th>

                <th className="px-4 py-3 font-medium">Slug</th>

                <th className="px-4 py-3 font-medium">Danh mục cha</th>

                <th className="px-4 py-3 font-medium">Trạng thái</th>

                <th className="px-4 py-3 font-medium">Ngày tạo</th>

                <th className="px-4 py-3 text-center font-medium w-40">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => {
                const isDeleted = !!category.deletedAt;

                return (
                  <tr
                    key={category.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {/* IMAGE */}
                    <td className="px-4 py-3">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* NAME */}
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-55">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    {/* slug */}
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="font-mono text-[11px] tracking-wide"
                      >
                        /{category.slug}
                      </Badge>
                    </td>

                    {/* parent name */}
                    <td className="px-4 py-3">
                      {category.parentName ? (
                        <CopyableText
                          value={category.parentName}
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

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <Badge variant={isDeleted ? "destructive" : "secondary"}>
                        {isDeleted ? "Đã ẩn" : "Đang hoạt động"}
                      </Badge>
                    </td>

                    {/* CREATED AT */}
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {format(new Date(category.createdAt), "dd/MM/yyyy")}
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
                            pendingId === category.id &&
                            pendingAction === "update"
                          }
                          onClick={() => {
                            setSelectedCategory(category);
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
                            pendingId === category.id &&
                            (pendingAction === "delete" ||
                              pendingAction === "restore")
                          }
                          variant={isDeleted ? "secondary" : "destructive"}
                          onClick={() =>
                            handleToggleDelete(category.id, isDeleted)
                          }
                        >
                          {isDeleted ? (
                            <RotateCcw className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </AsyncButton>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY */}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <span className="text-sm text-muted-foreground">
                      Không tìm thấy danh mục
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

      <CreateCategoryForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <UpdateCategoryForm
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        category={selectedCategory}
      />
    </QueryStateWrapper>
  );
};

export default AdminCategoryPage;
