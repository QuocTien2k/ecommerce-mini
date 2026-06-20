import { formatCurrency } from "@lib/format-currency";

interface Props {
  totalQuantity: number;
  totalPrice: number;
}

export const CartSummary = ({ totalQuantity, totalPrice }: Props) => {
  return (
    <div className="rounded-lg border p-4 h-fit sticky top-24">
      <h2 className="font-semibold mb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Số lượng sản phẩm</span>
          <span>{totalQuantity}</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-semibold text-base">
          <span>Tổng tiền</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
};
