import { formatCurrency } from "@lib/format-currency";
import { Badge } from "@components/ui/badge";
import type {
  OrderPricing as OrderPricingType,
  OrderVoucher,
} from "@shared/types/order.type";

const OrderPricing = ({
  pricing,
  voucher,
}: {
  pricing: OrderPricingType;
  voucher: OrderVoucher | null;
}) => {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Thanh toán</h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span>Tạm tính</span>
          <span>{formatCurrency(pricing.subtotal)}</span>
        </div>

        <div className="flex items-center justify-between gap-4 text-green-600">
          <span>Giảm giá</span>
          <span>-{formatCurrency(pricing.discountAmount)}</span>
        </div>

        {voucher && (
          <div className="flex items-center justify-between gap-4">
            <span>Mã giảm giá</span>

            <Badge
              variant="secondary"
              className="max-w-40 truncate sm:max-w-none"
            >
              {voucher.code}
            </Badge>
          </div>
        )}
      </div>

      <hr />

      <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-base font-semibold">Tổng thanh toán</span>

        <span className="text-xl font-bold wrap-break-word sm:text-2xl">
          {formatCurrency(pricing.totalPrice)}
        </span>
      </div>
    </div>
  );
};

export default OrderPricing;
