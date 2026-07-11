import { PAYMENT_METHODS, type PaymentMethod } from "../types/payment.type";

interface Props {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const paymentOptions = [
  {
    value: PAYMENT_METHODS.COD,
    label: "Thanh toán khi nhận hàng",
    description: "Trả tiền mặt khi giao hàng",
  },
  {
    value: PAYMENT_METHODS.VNPAY,
    label: "VNPay",
    description: "Thanh toán qua cổng VNPay",
  },
  {
    value: PAYMENT_METHODS.MOMO,
    label: "MoMo",
    description: "Thanh toán qua ví điện tử MoMo",
  },
] as const;

export const PaymentMethodSelector = ({ value, onChange }: Props) => {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium">Phương thức thanh toán</h2>

      <div className="space-y-2">
        {paymentOptions.map((method) => (
          <label
            key={method.value}
            className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition ${
              value === method.value ? "border-black" : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={value === method.value}
              onChange={() => onChange(method.value)}
              className="mt-1"
            />

            <div>
              <div className="text-sm font-medium">{method.label}</div>
              <div className="text-xs text-gray-500">{method.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
