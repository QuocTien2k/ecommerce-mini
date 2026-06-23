import { useParams } from "react-router-dom";
import { useOrderDetail } from "./hooks/useOrderDetail";
import OrderHeader from "./components/detail/OrderHeader";
import OrderReceiverInfo from "./components/detail/OrderReceiverInfo";
import OrderItems from "./components/detail/OrderItems";
import OrderPricing from "./components/detail/OrderPricing";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import OrderTimeline from "./components/detail/OrderTimeLine";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useOrderDetail(id!);

  if (!data) return <div>Order not found</div>;

  // console.log(data);

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="space-y-6">
        <OrderTimeline status={data.status} />

        {/* ONE BIG CARD */}
        <div className="rounded-lg border bg-card">
          <OrderHeader order={data} />

          <div className="p-4 space-y-6">
            <OrderReceiverInfo receiver={data.receiver} note={data.note} />

            <OrderItems items={data.items} />

            <OrderPricing pricing={data.pricing} voucher={data.voucher} />
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default OrderDetail;
