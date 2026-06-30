import { useParams } from "react-router-dom";
import { useOrderDetail } from "./hooks/useOrderDetail";
import OrderHeader from "./components/detail/OrderHeader";
import OrderReceiverInfo from "./components/detail/OrderReceiverInfo";
import OrderItems from "./components/detail/OrderItems";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import OrderTimeline from "./components/detail/OrderTimeline";
import OrderPricing from "./components/detail/OrderPricing";
import OrderNotFound from "@components/order/OrderNotFound";
import { useEffect } from "react";
import { CUSTOMER_ORDER_QUERY_KEY } from "./constant/order";
import { getOrderStatusLabel } from "@shared/types/order-status.utils";
import type { OrderDetail } from "@shared/types/order.type";
import { connectSocket, getSocket } from "@lib/socket";
import { queryClient } from "@lib/react-query";
import type { OrderStatusUpdatedEvent } from "./types/order-status-event-socket.type";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useOrderDetail(id!);

  //Đồng bộ trạng thái đơn hàng khi nhận thông báo realtime
  useEffect(() => {
    const socket = getSocket() ?? connectSocket();
    if (!socket) return;

    const handler = (data: OrderStatusUpdatedEvent) => {
      if (data.type !== "ORDER_STATUS_UPDATED") return;
      if (data.orderId !== id) return;

      queryClient.setQueryData(
        CUSTOMER_ORDER_QUERY_KEY.detail(data.orderId),
        (old: OrderDetail | undefined) => {
          if (!old) return old;

          return {
            ...old,
            status: data.orderStatus,
            statusLabel: getOrderStatusLabel(data.orderStatus),
            updatedAt: new Date().toISOString(),
          };
        },
      );
    };

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [id, queryClient]);

  if (!data) return <OrderNotFound />;

  //console.log(data);

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="space-y-6">
        <OrderTimeline status={data.status} />

        {/* ONE BIG CARD */}
        <div className="rounded-lg border bg-card">
          <OrderHeader order={data} />

          <div className="divide-y">
            <div className="p-6">
              <OrderReceiverInfo receiver={data.receiver} note={data.note} />
            </div>

            <div className="p-6">
              <OrderItems items={data.items} />
            </div>

            <div className="p-6">
              <OrderPricing pricing={data.pricing} voucher={data.voucher} />
            </div>
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default OrderDetail;
