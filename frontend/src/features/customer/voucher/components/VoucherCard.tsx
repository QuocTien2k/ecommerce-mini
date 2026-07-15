import { CalendarDays, RotateCcw, TicketPercent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";
import type { UserVoucher } from "../types/customer.type";
import { formatCurrency } from "@lib/format-currency";

type VoucherCardProps = {
  voucher: UserVoucher;
};

const VoucherCard = ({ voucher }: VoucherCardProps) => {
  const discountText =
    voucher.voucher.type === "PERCENT"
      ? `-${voucher.voucher.value}%`
      : `-${formatCurrency(voucher.voucher.value)}`;

  return (
    <Card className="border-l-primary transition-all hover:shadow-md border-l-4">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Voucher code */}
          <div className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-orange-100 to-amber-100 px-3 py-1.5 border border-orange-200">
            <TicketPercent className="h-4 w-4 text-orange-600" />

            <span className="font-mono text-sm font-bold tracking-wider text-orange-800">
              {voucher.voucher.code}
            </span>
          </div>

          {/* Discount */}
          <div>
            <p className="text-primary text-2xl font-bold">{discountText}</p>

            <p className="text-sm text-muted-foreground">Giá trị voucher</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />

                <span className="text-xs font-medium uppercase tracking-wide">
                  Hết hạn
                </span>
              </div>

              <p className="font-semibold">
                {voucher.voucher.endAt
                  ? formatDate(voucher.voucher.endAt)
                  : "Không giới hạn"}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <RotateCcw className="h-4 w-4" />

                <span className="text-xs font-medium uppercase tracking-wide">
                  Lượt còn lại
                </span>
              </div>

              <p className="font-semibold">
                {voucher.remainingUsage ?? "Không giới hạn"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoucherCard;
