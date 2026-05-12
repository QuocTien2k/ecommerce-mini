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

const AdminCategoryPage = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const { loading, run } = useScopedLoading();

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
                <th className="px-4 py-3 font-medium">ID</th>

                <th className="px-4 py-3 font-medium">Tên danh mục</th>

                <th className="px-4 py-3 font-medium">Slug</th>

                <th className="px-4 py-3 font-medium">Parent ID</th>

                {/* <th className="px-4 py-3 font-medium">Trạng thái</th> */}

                <th className="px-4 py-3 font-medium">Dữ liệu</th>

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
                    {/* ID */}
                    <td className="px-4 py-3">
                      <p>{category.id}</p>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 font-medium">
                      <CopyableText value={category.name} />
                    </td>

                    {/* Slug */}
                    <td className="px-4 py-3">
                      <Badge variant="outline">{category.slug}</Badge>
                    </td>

                    {/* Parent */}
                    <td className="px-4 py-3">
                      {category.parentId ? (
                        <CopyableText value={category.parentId} />
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Active */}
                    {/* <td className="px-4 py-3">
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td> */}

                    {/* Deleted */}
                    <td className="px-4 py-3">
                      <Badge variant={isDeleted ? "destructive" : "outline"}>
                        {isDeleted ? "Deleted" : "Normal"}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right w-40">
                      <AsyncButton
                        size="sm"
                        className="w-full max-w-28 ml-auto"
                        disabled={loading || isFetching}
                        loading={loading && pendingId === category.id}
                        variant={isDeleted ? "default" : "destructive"}
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
                    </td>
                  </tr>
                );
              })}

              {/* Empty */}
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
    </QueryStateWrapper>
  );
};

export default AdminCategoryPage;
