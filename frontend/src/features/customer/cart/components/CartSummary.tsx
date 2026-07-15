import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { setSelectedVoucherId } from "@features/customer/order/store/order.slice";
import type { AvailableVoucher } from "@features/customer/voucher/types/customer.type";
import { formatCurrency } from "@lib/format-currency";
import { Link } from "react-router-dom";
import { getVoucherLabel } from "../lib/voucher-label";

interface Props {
  totalQuantity: number;
  totalPrice: number;
  availableVouchers: AvailableVoucher[];
}

export const CartSummary = ({
  totalQuantity,
  totalPrice,
  availableVouchers,
}: Props) => {
  const dispatch = useAppDispatch();

  const selectedVoucherId = useAppSelector(
    (state) => state.order.selectedVoucherId,
  );

  const selectedVoucher =
    availableVouchers.find((v) => v.id === selectedVoucherId) ?? null;

  const discount = selectedVoucher?.discount ?? 0;
  const finalTotal = selectedVoucher?.finalTotal ?? totalPrice;

  return (
    <div className="rounded-lg border p-4 h-fit sticky top-24">
      <h2 className="font-semibold mb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Số lượng sản phẩm</span>
          <span>{totalQuantity}</span>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between">
            <span>Tổng tiền</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>

          {selectedVoucher && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá ({selectedVoucher.code})</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-base">
            <span>Thành tiền</span>
            <span>{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        {availableVouchers.length > 0 && (
          <div className="border-t pt-3 space-y-2">
            <span className="text-sm font-medium">Voucher khả dụng</span>

            <Select
              value={selectedVoucherId ?? ""}
              onValueChange={(value) => dispatch(setSelectedVoucherId(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn voucher" />
              </SelectTrigger>

              <SelectContent position="popper">
                {availableVouchers.map((voucher) => (
                  <SelectItem key={voucher.id} value={voucher.id}>
                    {voucher.code} - {getVoucherLabel(voucher)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button
        asChild
        className="w-full mt-4"
        size="lg"
        disabled={!totalQuantity}
      >
        <Link to="/checkout">Tiến hành thanh toán</Link>
      </Button>
    </div>
  );
};
