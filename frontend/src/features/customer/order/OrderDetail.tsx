import { useParams } from "react-router-dom";
import { useOrderDetail } from "./hooks/useOrderDetail";
import OrderHeader from "./components/detail/OrderHeader";
import OrderReceiverInfo from "./components/detail/OrderReceiverInfo";
import OrderItems from "./components/detail/OrderItems";
import OrderPricing from "./components/detail/OrderPricing";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useOrderDetail(id!);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Order not found</div>;

  return (
    <div className="order-detail">
      <OrderHeader order={data} />
      <OrderReceiverInfo receiver={data.receiver} note={data.note} />
      <OrderItems items={data.items} />
      <OrderPricing pricing={data.pricing} voucher={data.voucher} />
    </div>
  );
};

export default OrderDetail;
