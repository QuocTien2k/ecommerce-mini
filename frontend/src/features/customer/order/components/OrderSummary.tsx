import { AsyncButton } from "@components/common/async-button";

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
    <>
      <div className="border p-4 rounded-md space-y-2">
        <div>Tạm tính: {totalPrice.toLocaleString()}₫</div>
        <div>Tổng số lượng: {totalQuantity}</div>
      </div>

      <AsyncButton
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
      </AsyncButton>
    </>
  );
};

export default OrderSummary;
