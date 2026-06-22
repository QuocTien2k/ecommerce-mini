import { useAppSelector } from "@app/hooks";
import { useGetCart } from "../cart/hooks/useGetCart";
import { useCreateOrder } from "./hooks/useCreateOrder";
import { EmptyState } from "@components/cart/EmptyState";
import { ShoppingCart } from "lucide-react";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";
import OrderCustomerInfo from "./components/OrderCustomerInfo";
import OrderItemsPreview from "./components/OrderItemsPreview";
import OrderSummary from "./components/OrderSummary";
import { useOrderForm } from "./forms/order-customer-info";
import { useEffect } from "react";
import { PaymentMethodSelector } from "./components/PaymentMethod";
import { useCreateVnpayPayment } from "../payment/hooks/useCreateVnpay";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  //Cart
  const { data: cartResponse, isLoading } = useGetCart();
  const cart = cartResponse?.data;

  //Auth
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = Boolean(user?.id);
  const form = useOrderForm(user?.phone, user?.address);

  useEffect(() => {
    form.reset({
      receiverPhone: user?.phone ?? "",
      receiverAddress: user?.address ?? "",
    });
  }, [user, form]);

  const createOrderMutation = useCreateOrder();
  const createVnpayPayment = useCreateVnpayPayment();
  const navigate = useNavigate();

  const handleCreateOrder = form.handleSubmit(async (values) => {
    if (!cart || cart.items.length === 0) return;

    const res = await createOrderMutation.mutateAsync({
      receiverName: user?.fullname ?? "",
      receiverPhone: values.receiverPhone,
      receiverAddress: values.receiverAddress,
      paymentMethod: values.paymentMethod,
      note: "",
      voucherCode: null,
      items: cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    const order = res.data.order;

    if (values.paymentMethod === "VNPAY") {
      createVnpayPayment.mutate(order.id);
      return;
    }

    navigate("/order-success");
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-10">
        <EmptyState
          icon={<ShoppingCart className="size-8" />}
          title="Chưa đăng nhập"
          description="Vui lòng đăng nhập để tiếp tục đặt hàng"
        />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-10">
        <EmptyState
          icon={<ShoppingCart className="size-8" />}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng"
        />
      </div>
    );
  }

  return (
    <QueryStateWrapper isLoading={isLoading}>
      <div className="container py-6 space-y-6">
        <h1 className="text-xl font-semibold">Đặt hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <OrderCustomerInfo user={user} form={form} />

            <OrderItemsPreview items={cart.items} />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1 space-y-4">
            <div className="sticky top-6 space-y-4">
              <OrderSummary
                totalPrice={cart.totalPrice}
                totalQuantity={cart.totalQuantity}
                isSubmitting={createOrderMutation.isPending}
                onSubmit={handleCreateOrder}
              />

              <PaymentMethodSelector
                value={form.watch("paymentMethod")}
                onChange={(value) => form.setValue("paymentMethod", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default OrderPage;
