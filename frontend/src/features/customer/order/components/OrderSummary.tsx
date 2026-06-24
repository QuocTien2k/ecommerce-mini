import { AsyncButton } from "@components/common/async-button";
import { formatCurrency } from "@lib/format-currency";

interface OrderSummaryProps {
  totalPrice: number;
  totalQuantity: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const OrderSummary = ({
  totalPrice,
  totalQuantity,
  isSubmitting,
  onSubmit,
}: OrderSummaryProps) => {
  return (
    <div className="space-y-4">
      {/* Summary block */}
      <div className="border rounded-md p-4 space-y-3 bg-white">
        <h2 className="text-sm font-medium">Tóm tắt đơn hàng</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Số lượng</span>
            <span>{totalQuantity}</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <AsyncButton
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-black text-white py-2 rounded-md"
      >
        {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
      </AsyncButton>
    </div>
  );
};

export default OrderSummary;
