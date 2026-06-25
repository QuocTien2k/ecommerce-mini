import type { OrderStatus } from "@features/customer/order/types/order-status.type";
import type { GetOrdersQuery, OrderSummary } from "@shared/types/order.type";
import { useState } from "react";
import { useAdminOrders } from "./hooks/useAdminOrders";
import AppPagination from "@components/common/pagination";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@shared/types/order-status";
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

const AdminOrderPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [orderId, setOrderId] = useState("");

  const params: GetOrdersQuery = {
    page,
    status,
    orderId: orderId || undefined,
  };

  const { data, isLoading } = useAdminOrders(params);

  // DATA NORMALIZATION
  const orders: OrderSummary[] = data?.data ?? [];
  const meta = data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  // HANDLERS
  const handleChangeStatus = (value: string) => {
    setPage(1);

    setStatus(value ? (value as OrderStatus) : undefined);
  };

  const handleSearchOrderId = (value: string) => {
    setPage(1);
    setOrderId(value);
  };

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Title title="Quản lý đơn hàng" />

          <span className="text-sm text-muted-foreground">
            Tổng số lượng đơn hàng: {meta?.total ?? 0}
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-3 items-center">
          {/* SEARCH ORDER ID */}
          <Input
            value={orderId}
            onChange={(e) => handleSearchOrderId(e.target.value)}
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
        </div>

        {/* List */}
        <div className="space-y-2">
          {orders.map((order) => {
            const color = getOrderStatusColor(order.status);
            const label = getOrderStatusLabel(order.status);

            return (
              <div
                key={order.id}
                className="border rounded p-3 flex justify-between"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    <CopyableText value={order.id} />
                  </div>

                  <div
                    className={`text-xs px-2 py-1 inline-block rounded ${color}`}
                  >
                    {label}
                  </div>

                  <div className="text-sm text-gray-600">
                    Items: {order.itemCount}
                  </div>

                  <div className="text-sm text-gray-600">
                    <div>{formatDate(order.createdAt)}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(order.totalPrice)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {!isLoading && orders.length === 0 && (
          <div className="text-center text-gray-500 py-6">No orders found</div>
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

export default AdminOrderPage;
