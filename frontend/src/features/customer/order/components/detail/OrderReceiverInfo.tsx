import type { OrderReceiver } from "../../types/customerOrder.type";
import { User, Phone, MapPin, FileText } from "lucide-react";

const OrderReceiverInfo = ({
  receiver,
  note,
}: {
  receiver: OrderReceiver;
  note?: string | null;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Thông tin người nhận
      </h3>

      <div className="space-y-4">
        {/* Name / Phone / Address */}
        <div className="flex items-center gap-6 border-b pb-3 text-sm">
          {/* Name */}
          <div className="flex items-center gap-2 flex-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{receiver.name}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 flex-1">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{receiver.phone}</span>
          </div>

          {/* Address (wider) */}
          <div className="flex items-center gap-2 flex-2 min-w-0">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Address:</span>
            <span className="font-medium truncate">{receiver.address}</span>
          </div>
        </div>

        {/* Note */}
        {note && (
          <div className="flex items-start gap-3 pt-2 border-t">
            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Note</div>
              <div className="text-sm italic text-muted-foreground">{note}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReceiverInfo;
