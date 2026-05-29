import { useState } from "react";
import { useAdminVoucherFilter } from "./hooks/admin/useAdminVoucherFilter";
import { useAdminVouchersQuery } from "./hooks/admin/useAdminVoucherQuery";
import {
  VOUCHER_SCOPES,
  VOUCHER_TYPES,
  type AdminVoucher,
} from "./types/admin-voucher.type";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import { Title } from "@components/ui/title-module";
import { Button } from "@components/ui/button";
import AppPagination from "@components/common/pagination";
import AdminVoucherFilter from "./components/admin/AdminVoucherFilter";
import { cn } from "@lib/utils";
import { Badge } from "@components/ui/badge";
import { format } from "date-fns";
import { AsyncButton } from "@components/common/async-button";
import { Eye, RotateCcw, Trash2 } from "lucide-react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import CopyableText from "@components/common/copyable-text";
import { AdminCreateVoucher } from "./components/admin/AdminCreateVoucher";
import { AdminUpdateVoucher } from "./components/admin/AdminUpdateVoucher";
import AdminVoucherDetailModal from "./components/admin/AdminVoucherDetail";

type PendingAction = "update" | "delete" | null;

const AdminVoucherPage = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<AdminVoucher | null>(
    null,
  );

  const { page, setPage, filters, filterActions, queryParams, resetFilters } =
    useAdminVoucherFilter();
  const { data, isLoading, isFetching } = useAdminVouchersQuery(queryParams);
  const { loading, run } = useScopedLoading();

  const vouchers: AdminVoucher[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  const handleVoucherDelete = async (voucherId: string) => {
    console.log("Voucher id: ", voucherId);
  };

  return (
    <QueryStateWrapper isLoading={isLoading} isFetching={isFetching}>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý voucher" />

          <span className="text-sm text-muted-foreground">
            Tổng số voucher: {meta?.total ?? 0}
          </span>
          <Button onClick={() => setOpenCreate(true)}>Tạo voucher</Button>
        </div>

        <AdminVoucherFilter
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
                <th className="px-4 py-3 font-medium">Mã voucher</th>

                <th className="px-4 py-3 font-medium">Loại</th>

                <th className="px-4 py-3 font-medium">Giá trị</th>

                <th className="px-4 py-3 font-medium">Phạm vi</th>

                <th className="px-4 py-3 font-medium">Sử dụng</th>

                <th className="px-4 py-3 font-medium">Thời gian</th>

                <th className="px-4 py-3 font-medium">Trạng thái</th>

                <th className="px-4 py-3 font-medium">Ngày tạo</th>

                <th className="px-4 py-3 text-center font-medium w-40">
                  Hành động
                </th>
                <th className="px-4 py-3 font-medium">Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {vouchers.map((voucher) => {
                const isExpired =
                  voucher.endAt &&
                  new Date(voucher.endAt).getTime() < Date.now();

                const isUpcoming =
                  voucher.startAt &&
                  new Date(voucher.startAt).getTime() > Date.now();

                return (
                  <tr
                    key={voucher.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {/* CODE */}
                    <td className="px-4 py-3">
                      <CopyableText
                        value={voucher.code}
                        className="px-2 py-1 font-sans text-sm font-semibold text-primary hover:text-primary"
                      />
                    </td>

                    {/* TYPE */}
                    <td className="px-4 py-3">
                      {voucher.type === VOUCHER_TYPES.PERCENT ? (
                        <Badge className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-100">
                          Phần trăm
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
                          Cố định
                        </Badge>
                      )}
                    </td>

                    {/* VALUE */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {voucher.type === VOUCHER_TYPES.PERCENT
                            ? `${voucher.value}%`
                            : `${Number(voucher.value).toLocaleString("vi-VN")}đ`}
                        </span>

                        {voucher.maxDiscount && (
                          <span className="text-xs text-muted-foreground">
                            Max:{" "}
                            {Number(voucher.maxDiscount).toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </span>
                        )}
                      </div>
                    </td>

                    {/* SCOPE */}
                    <td className="px-4 py-3">
                      {voucher.scope === VOUCHER_SCOPES.ORDER ? (
                        <Badge variant="secondary">Toàn đơn hàng</Badge>
                      ) : voucher.scope === VOUCHER_SCOPES.PRODUCT ? (
                        <Badge variant="outline">Theo sản phẩm</Badge>
                      ) : (
                        <Badge variant="outline">Theo danh mục</Badge>
                      )}
                    </td>

                    {/* USAGE */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {voucher.usedCount}
                          {voucher.usageLimit ? ` / ${voucher.usageLimit}` : ""}
                        </span>

                        {voucher.minOrderValue && (
                          <span className="text-xs text-muted-foreground">
                            Min:{" "}
                            {Number(voucher.minOrderValue).toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </span>
                        )}
                      </div>
                    </td>

                    {/* TIME */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs">
                        <span>
                          Start:{" "}
                          {voucher.startAt
                            ? format(new Date(voucher.startAt), "dd/MM/yyyy")
                            : "--"}
                        </span>

                        <span>
                          End:{" "}
                          {voucher.endAt
                            ? format(new Date(voucher.endAt), "dd/MM/yyyy")
                            : "--"}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        {!voucher.isActive ? (
                          <Badge className="bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-100">
                            Tạm khóa
                          </Badge>
                        ) : isExpired ? (
                          <Badge variant="destructive">Hết hạn</Badge>
                        ) : isUpcoming ? (
                          <Badge className="bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-100">
                            Sắp diễn ra
                          </Badge>
                        ) : (
                          <Badge className="bg-violet-100 text-violet-700 border border-violet-200 hover:bg-violet-100">
                            Đang hoạt động
                          </Badge>
                        )}

                        {voucher.isDeleted && (
                          <Badge variant="destructive">Đã xóa</Badge>
                        )}
                      </div>
                    </td>

                    {/* CREATED AT */}
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {format(new Date(voucher.createdAt), "dd/MM/yyyy")}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <AsyncButton
                          size="sm"
                          variant="edit"
                          disabled={loading || isFetching || voucher.isDeleted}
                          loading={
                            loading &&
                            pendingId === voucher.id &&
                            pendingAction === "update"
                          }
                          onClick={() => {
                            setSelectedVoucher(voucher);
                            setOpenUpdate(true);
                          }}
                        >
                          Cập nhật
                        </AsyncButton>

                        <AsyncButton
                          size="icon"
                          showLoadingText={false}
                          disabled={loading || isFetching || voucher.isDeleted}
                          loading={
                            loading &&
                            pendingId === voucher.id &&
                            pendingAction === "delete"
                          }
                          variant="destructive"
                          onClick={() => handleVoucherDelete(voucher.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </AsyncButton>
                      </div>
                    </td>

                    {/* DETAIL */}
                    <td className="px-4 py-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          setOpenDetail(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY */}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10">
                    <span className="text-sm text-muted-foreground">
                      Không tìm thấy voucher
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
      <AdminCreateVoucher
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <AdminUpdateVoucher
        open={openUpdate}
        onClose={() => {
          setOpenUpdate(false);
          setSelectedVoucher(null);
        }}
        voucher={selectedVoucher}
      />

      <AdminVoucherDetailModal
        open={openDetail}
        onOpenChange={setOpenDetail}
        voucherId={selectedVoucher?.id}
      />
    </QueryStateWrapper>
  );
};

export default AdminVoucherPage;
