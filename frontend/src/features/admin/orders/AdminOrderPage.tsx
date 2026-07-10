import type { OrderStatus } from "@shared/types/order-status.type";
import type { GetOrdersQuery, OrderSummary } from "@shared/types/order.type";
import { useState } from "react";
import { useAdminOrders } from "./hooks/useAdminOrders";
import AppPagination from "@components/common/pagination";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@shared/types/order-status.utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Title } from "@components/ui/title-module";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import CopyableText from "@components/common/copyable-text";
import { formatDate } from "@lib/format-date";
import { formatCurrency } from "@lib/format-currency";
import OrderNotFound from "@components/order/OrderNotFound";
import OrderEmpty from "@components/order/OrderEmpty";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { AsyncButton } from "@components/common/async-button";
import { Download, Eye, Info, Pencil } from "lucide-react";
import AdminOrderDetail from "./components/AdminOrderDetail";
import AdminUpdateOrder from "./components/AdminUpdateOrder";
import OrderStatusGuideModal from "./components/OrderStatusGuide";
import { useExportOrders } from "./hooks/useAdminOrderExport";

const AdminOrderPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [openGuide, setOpenGuide] = useState(false);

  // UI state
  const [searchInput, setSearchInput] = useState("");

  // Applied filter
  const [orderId, setOrderId] = useState<string | undefined>();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const params: GetOrdersQuery = {
    page,
    status,
    orderId: orderId || undefined,
  };

  const { data, isLoading, isFetching } = useAdminOrders(params);

  //export excell
  const { exportOrders } = useExportOrders();
  const handleExport = async () => {
    await exportOrders({
      status,
    });
  };

  // DATA NORMALIZATION
  const orders: OrderSummary[] = data?.data ?? [];
  const meta = data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  // HANDLERS
  const handleChangeStatus = (value: string) => {
    setPage(1);

    setStatus(value === "ALL" ? undefined : (value as OrderStatus));
  };

  const onReset = () => {
    setPage(1);

    setSearchInput("");

    setOrderId(undefined);

    setStatus(undefined);
  };

  const handleCloseModals = () => {
    setOpenDetail(false);
    setOpenUpdate(false);
    setSelectedOrderId(null);
  };

  const hasFilters = !!status || !!orderId;

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="p-6 space-y-6 bg-white border border-gray-300 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Title title="Quản lý đơn hàng" />

            <p className="text-sm text-muted-foreground">
              Tổng số đơn hàng: {meta?.total ?? 0}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenGuide(true)}
            >
              <Info className="mr-2 h-4 w-4" />
              Hướng dẫn
            </Button>

            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-3 items-center">
          {/* SEARCH ORDER ID */}
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                setOrderId(searchInput.trim() || undefined);
              }
            }}
            placeholder="Tìm kiếm id đơn hàng..."
            className="w-55"
          />

          {/* Status*/}
          <Select
            value={status ?? "ALL"}
            onValueChange={(value) => handleChangeStatus(value)}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>

            <SelectContent position="popper">
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

              <SelectItem value="PENDING">Đã đặt hàng</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
              <SelectItem value="READY_TO_SHIP">Đã xuất kho</SelectItem>
              <SelectItem value="SHIPPING">Đang vận chuyển</SelectItem>
              <SelectItem value="DELIVERED">Giao thành công</SelectItem>
              <SelectItem value="CANCELLED">Đã huỷ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={"default"}
            disabled={!searchInput.trim()}
            onClick={() => {
              setPage(1);
              setOrderId(searchInput.trim() || undefined);
            }}
          >
            Tìm kiếm
          </Button>

          <Button variant="warning" onClick={onReset} className="shrink-0 px-5">
            Reset
          </Button>
        </div>

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
                <th className="px-4 py-3 font-medium">Mã đơn</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Số sản phẩm</th>
                <th className="px-4 py-3 font-medium">Ngày tạo</th>
                <th className="px-4 py-3 font-medium text-right">Tổng tiền</th>
                <th className="px-4 py-3 font-medium text-center w-32">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const color = getOrderStatusColor(order.status);
                const label = getOrderStatusLabel(order.status);

                return (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {/* ORDER ID */}
                    <td className="px-4 py-3 font-medium">
                      <CopyableText value={order.id} />
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${color}`}>
                        {label}
                      </span>
                    </td>

                    {/* ITEM COUNT */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.itemCount}
                    </td>

                    {/* CREATED AT */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* TOTAL */}
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <AsyncButton
                          size="icon"
                          variant="secondary"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setOpenDetail(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </AsyncButton>

                        <AsyncButton
                          size="icon"
                          variant="edit"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setOpenUpdate(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </AsyncButton>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex justify-center py-10">
                      {hasFilters ? <OrderNotFound /> : <OrderEmpty />}
                    </div>
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
      {/* Modal */}
      <AdminUpdateOrder
        open={openUpdate}
        onClose={handleCloseModals}
        orderId={selectedOrderId}
      />

      <AdminOrderDetail
        open={openDetail}
        orderId={selectedOrderId}
        onClose={handleCloseModals}
      />

      <OrderStatusGuideModal open={openGuide} onOpenChange={setOpenGuide} />
    </QueryStateWrapper>
  );
};

export default AdminOrderPage;
