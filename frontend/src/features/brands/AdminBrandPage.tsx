import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useState } from "react";
import { useAdminBrandFilter } from "./hooks/useAdminBrandFilter";
import { useAdminBrandQuery } from "./hooks/useAdminBrandQuery";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Title } from "@components/ui/title-module";
import { Button } from "@components/ui/button";
import type { AdminBrandItem } from "./types/admin-brand.type";
import AdminBrandFilter from "./components/AdminBrandFilter";
import AppPagination from "@components/common/pagination";
import { cn } from "@lib/utils";
import { RotateCcw, Trash2 } from "lucide-react";
import { AsyncButton } from "@components/common/async-button";
import { format } from "date-fns";
import { Badge } from "@components/ui/badge";
import CopyableText from "@components/common/copyable-text";
import AminCreateBrand from "./components/AminCreateBrand";
import AdminUpdateBrand from "./components/AdminUpdateBrand";

type PendingAction = "update" | "delete" | "restore" | null;

const AdminBrandPage = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<AdminBrandItem | null>(
    null,
  );

  const { loading, run } = useScopedLoading();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const { page, setPage, filters, filterActions, queryParams, resetFilters } =
    useAdminBrandFilter();
  const { data, isLoading, isFetching } = useAdminBrandQuery(queryParams);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedBrand(null);
  };

  const handleToggleDelete = async (brandId: string, isDeleted: boolean) => {};

  const brands: AdminBrandItem[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý thương hiệu" />

          <span className="text-sm text-muted-foreground">
            Tổng số thương hiệu: {meta?.total ?? 0}
          </span>
          <Button onClick={() => setOpenCreate(true)}>Tạo thương hiệu</Button>
        </div>

        {/* Filters */}
        <AdminBrandFilter
          filters={filters}
          actions={filterActions}
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
                <th className="px-4 py-3 font-medium">Tên thương hiệu</th>

                <th className="px-4 py-3 font-medium">Slug</th>

                <th className="px-4 py-3 font-medium">Trạng thái</th>

                <th className="px-4 py-3 font-medium">Ngày tạo</th>

                <th className="px-4 py-3 text-center font-medium w-40">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {brands.map((brand) => {
                const isDeleted = !!brand.deletedAt;

                return (
                  <tr
                    key={brand.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {/* NAME */}
                    <td className="px-4 py-3">
                      <CopyableText
                        value={brand.name}
                        className=" text-[15px] font-semibold text-foreground hover:text-primary transition-colors max-w-60 truncate cursor-pointer leading-none"
                      />
                    </td>

                    {/* SLUG */}
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="
                font-mono
                text-[11px]
                tracking-wide
                font-semibold
              "
                      >
                        /{brand.slug}
                      </Badge>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      {isDeleted ? (
                        <Badge variant="destructive">Đã xóa</Badge>
                      ) : brand.isActive ? (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-700 hover:bg-amber-100"
                        >
                          Tạm khóa
                        </Badge>
                      )}
                    </td>

                    {/* CREATED AT */}
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {format(new Date(brand.createdAt), "dd/MM/yyyy")}
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
                            pendingId === brand.id &&
                            pendingAction === "update"
                          }
                          onClick={() => {
                            setSelectedBrand(brand);
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
                            pendingId === brand.id &&
                            (pendingAction === "delete" ||
                              pendingAction === "restore")
                          }
                          variant={isDeleted ? "secondary" : "destructive"}
                          onClick={() =>
                            handleToggleDelete(brand.id, isDeleted)
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
              {brands.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <span className="text-sm text-muted-foreground">
                      Không tìm thấy thương hiệu
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {openCreate && (
          <AminCreateBrand
            open={openCreate}
            onClose={() => setOpenCreate(false)}
          />
        )}

        {openUpdate && selectedBrand && (
          <AdminUpdateBrand
            open={openUpdate}
            onClose={handleCloseUpdate}
            brand={selectedBrand}
          />
        )}

        {/* Pagination */}
        <AppPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </QueryStateWrapper>
  );
};

export default AdminBrandPage;
