import type { OrderReceiver } from "@shared/types/order.type";
import { User, Phone, MapPin, FileText } from "lucide-react";

type Props = {
  receiver: OrderReceiver;
  note?: string | null;
};

const OrderReceiverInfo = ({ receiver, note }: Props) => {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Thông tin người nhận</h3>

        <p className="text-sm text-muted-foreground">
          Thông tin giao hàng của đơn hàng
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Name */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <div className="rounded-md bg-muted p-2">
            <User className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Người nhận</p>

            <p className="font-medium">{receiver.name}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <div className="rounded-md bg-muted p-2">
            <Phone className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Số điện thoại</p>

            <p className="font-medium">{receiver.phone}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 rounded-lg border p-4 md:col-span-2">
          <div className="rounded-md bg-muted p-2">
            <MapPin className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Địa chỉ nhận hàng</p>

            <p className="font-medium wrap-break-words">{receiver.address}</p>
          </div>
        </div>
      </div>

      {note && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Ghi chú đơn hàng</p>

              <p className="mt-1 text-sm">{note}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderReceiverInfo;
