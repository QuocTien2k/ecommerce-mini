import { useAppDispatch, useAppSelector } from "@app/hooks";
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
import { clearSelectedVoucher } from "./store/order.slice";
import { useGetAvailableVouchers } from "../voucher/hooks/useAvailabelVoucher";
import { sonnerToast } from "@lib/sonner-toast";
import { useCreateMomoPayment } from "../payment/hooks/useCreateMomo";
import { useCreateCodPayment } from "../payment/hooks/useCreateCod";
import { getErrorMessage } from "@lib/error";
import { Controller } from "react-hook-form";

const OrderPage = () => {
  //Cart
  const { data: cartResponse, isLoading } = useGetCart();
  const cart = cartResponse?.data;

  //Auth
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = Boolean(user?.id);
  const form = useOrderForm(user?.phone, user?.address);

  //voucher
  const dispatch = useAppDispatch();
  const selectedVoucherId = useAppSelector(
    (state) => state.order.selectedVoucherId,
  );
  const { data: voucherResponse } = useGetAvailableVouchers(cart?.totalPrice);
  const availableVouchers = voucherResponse?.data;

  const selectedVoucher =
    availableVouchers?.find((v) => v.id === selectedVoucherId) ?? null;

  useEffect(() => {
    form.reset({
      receiverPhone: user?.phone ?? "",
      receiverAddress: user?.address ?? "",
      paymentMethod: "COD",
      note: "",
    });
  }, [user, form]);

  const createOrderMutation = useCreateOrder();
  const createCodPayment = useCreateCodPayment();
  const createVnpayPayment = useCreateVnpayPayment();
  const createMomoPayment = useCreateMomoPayment();
  const navigate = useNavigate();

  const handleCreateOrder = form.handleSubmit(async (values) => {
    if (!cart || cart.items.length === 0) return;

    sonnerToast.dismiss("checkout-error");

    try {
      const res = await createOrderMutation.mutateAsync({
        receiverName: user?.fullname ?? "",
        receiverPhone: values.receiverPhone,
        receiverAddress: values.receiverAddress,
        paymentMethod: values.paymentMethod,
        note: values.note,
        voucherCode: selectedVoucher?.code ?? null,
        items: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      dispatch(clearSelectedVoucher());

      const order = res.data.order;

      switch (values.paymentMethod) {
        case "VNPAY":
          createVnpayPayment.mutate(order.id);
          return;

        case "MOMO":
          createMomoPayment.mutate(order.id);
          return;

        case "COD":
          createCodPayment.mutate(order.id, {
            onSuccess: (paymentRes) => {
              if (!paymentRes.status) return;

              sonnerToast.success("Đặt hàng thành công");

              navigate(`/order/${order.id}`);
            },
          });
          return;

        default:
          sonnerToast.success(res.message || "Tạo đơn hàng thành công");
          navigate(`/order/${order.id}`);
      }
    } catch (error) {
      console.error("Create order error:", error);

      sonnerToast.error(getErrorMessage(error, "Đặt hàng thất bại"), {
        id: "checkout-error",
      });
    }
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
                selectedVoucher={selectedVoucher}
                isSubmitting={createOrderMutation.isPending}
                onSubmit={handleCreateOrder}
              />

              <Controller
                control={form.control}
                name="paymentMethod"
                render={({ field, fieldState }) => (
                  <PaymentMethodSelector
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </QueryStateWrapper>
  );
};

export default OrderPage;
