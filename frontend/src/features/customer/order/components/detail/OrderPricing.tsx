import type {
  OrderPricing as OrderPricingType,
  OrderVoucher,
} from "../../types/customerOrder.type";

const OrderPricing = ({
  pricing,
  voucher,
}: {
  pricing: OrderPricingType;
  voucher: OrderVoucher | null;
}) => {
  return (
    <div>
      <h3>Payment Summary</h3>

      <div>Subtotal: {pricing.subtotal}</div>
      <div>Discount: {pricing.discountAmount}</div>

      {voucher && (
        <div>
          Voucher: {voucher.code} (-{voucher.value})
        </div>
      )}

      <hr />

      <div>
        <strong>Total: {pricing.totalPrice}</strong>
      </div>
    </div>
  );
};

export default OrderPricing;
