import type { OrderReceiver } from "../../types/customerOrder.type";

const OrderReceiverInfo = ({
  receiver,
  note,
}: {
  receiver: OrderReceiver;
  note?: string | null;
}) => {
  return (
    <div>
      <h3>Receiver</h3>

      <div>Name: {receiver.name}</div>
      <div>Phone: {receiver.phone}</div>
      <div>Address: {receiver.address}</div>

      {note && <div>Note: {note}</div>}
    </div>
  );
};

export default OrderReceiverInfo;
