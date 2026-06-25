import { formatCurrency } from "@lib/format-currency";
import { Badge } from "@components/ui/badge";
import type { OrderPricing, OrderVoucher } from "@shared/types/order.type";

const OrderPricing = ({
  pricing,
  voucher,
}: {
  pricing: OrderPricing;
  voucher: OrderVoucher | null;
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Thanh toán</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{formatCurrency(pricing.subtotal)}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Giảm giá</span>
          <span>-{formatCurrency(pricing.discountAmount)}</span>
        </div>

        {voucher && (
          <div className="flex justify-between">
            <span>Mã giảm giá</span>

            <Badge variant="secondary">{voucher.code}</Badge>
          </div>
        )}
      </div>

      <hr />

      <div className="border-t pt-4 flex justify-between items-center">
        <span className="text-base font-semibold">Tổng thanh toán</span>

        <span className="text-2xl font-bold">
          {formatCurrency(pricing.totalPrice)}
        </span>
      </div>
    </div>
  );
};

export default OrderPricing;
