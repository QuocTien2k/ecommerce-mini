import { useAppSelector } from "@app/hooks";
import { useGetCart } from "../cart/hooks/useGetCart";
import { useCreateOrder } from "./hooks/useCreateOrder";
import { EmptyState } from "@components/cart/EmptyState";
import { ShoppingCart } from "lucide-react";
import { QueryStateWrapper } from "@components/query/QueryStateWrapper";

const OrderPage = () => {
  //Cart
  const { data: cartResponse, isLoading } = useGetCart();
  const cart = cartResponse?.data;

  //Auth
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = Boolean(user?.id);

  const createOrderMutation = useCreateOrder();

  const handleCreateOrder = () => {
    if (!cart || cart.items.length === 0) return;

    createOrderMutation.mutate({
      receiverName: user?.fullname ?? "",
      receiverPhone: user?.phone ?? "",
      receiverAddress: user?.address ?? "",

      paymentMethod: "COD",

      note: "",

      voucherCode: null,

      items: cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });
  };

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

        {/* USER INFO (preview only) */}
        <div className="border p-4 rounded-md">
          <div>Người nhận: {user?.fullname}</div>
          <div>SĐT: {user?.phone}</div>
          <div>Địa chỉ: {user?.address}</div>
        </div>

        {/* CART PREVIEW */}
        <div className="border rounded-md p-4 space-y-3">
          <h2 className="font-medium">Sản phẩm</h2>

          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                {item.productName} × {item.quantity}
              </div>
              <div>{item.totalPrice.toLocaleString()}₫</div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="border p-4 rounded-md space-y-2">
          <div>Tạm tính: {cart.totalPrice.toLocaleString()}₫</div>
          <div>Tổng số lượng: {cart.totalQuantity}</div>
        </div>

        {/* ACTION */}
        <button
          onClick={handleCreateOrder}
          disabled={createOrderMutation.isPending}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          {createOrderMutation.isPending ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </QueryStateWrapper>
  );
};

export default OrderPage;
