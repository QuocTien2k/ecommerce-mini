import { formatProductAttributes } from "@/utils/format-product-attributes";
import { formatCurrency } from "@lib/format-currency";
import { ScrollArea } from "@components/ui/scroll-area";
import { Link } from "react-router-dom";
import type { OrderItemDetail } from "@shared/types/order.type";
import {
  ORDER_STATUSES,
  type OrderStatus,
} from "@shared/types/order-status.type";
import ProductRating from "@features/customer/rating/ProductRating";

type Props = {
  items: OrderItemDetail[];
  status: OrderStatus;
};

const OrderItems = ({ items, status }: Props) => {
  const shouldScroll = items.length > 5;

  const content = (
    <>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={["p-4", index !== items.length - 1 && "border-b"]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between">
            {/* LEFT */}
            <div className="flex min-w-0 flex-1 gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted sm:h-20 sm:w-20">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <Link
                  to={`/products/${item.slug}`}
                  className="line-clamp-2 font-medium leading-5 hover:underline"
                >
                  {item.productName}
                </Link>

                {item.selectedAttributes && (
                  <p className="text-sm text-muted-foreground">
                    {formatProductAttributes(item.selectedAttributes)}
                  </p>
                )}

                <p className="text-sm text-muted-foreground">
                  Đơn giá: {formatCurrency(item.price)}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-between gap-6 border-t pt-3 text-sm md:border-0 md:pt-0">
              <div className="text-left md:min-w-18 md:text-center">
                <div className="text-muted-foreground">Số lượng</div>

                <div className="font-medium">x{item.quantity}</div>
              </div>

              <div className="md:min-w-35 text-right">
                <div className="text-muted-foreground">Thành tiền</div>

                <div className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            </div>
          </div>

          {status === ORDER_STATUSES.DELIVERED && (
            <div className="mt-4 border-t pt-4">
              <ProductRating productId={item.productId} />
            </div>
          )}
        </div>
      ))}
    </>
  );

  //console.log(items);

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Sản phẩm đã đặt</h3>

        <p className="text-sm text-muted-foreground">
          {items.length} sản phẩm trong đơn hàng
        </p>
      </div>

      {shouldScroll ? (
        <ScrollArea className="max-h-[70vh] md:h-140 rounded-lg border">
          <div>{content}</div>
        </ScrollArea>
      ) : (
        <div className="rounded-lg border">
          <div>{content}</div>
        </div>
      )}
    </section>
  );
};

export default OrderItems;
