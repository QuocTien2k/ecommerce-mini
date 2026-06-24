import { formatProductAttributes } from "@/utils/format-product-attributes";
import type { OrderItemDetail } from "../../types/customerOrder.type";
import { formatCurrency } from "@lib/format-currency";
import { ScrollArea } from "@components/ui/scroll-area";

const OrderItems = ({ items }: { items: OrderItemDetail[] }) => {
  const shouldScroll = items.length > 5;

  const content = (
    <>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={[
            "flex items-start justify-between gap-4 p-4",
            index !== items.length - 1 && "border-b",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* LEFT */}
          <div className="flex flex-1 gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
              <img
                src={item.productImage}
                alt={item.productName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="font-medium leading-5">{item.productName}</h4>

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
          <div className="flex items-center gap-8 text-sm">
            <div className="min-w-17.5 text-center">
              <div className="text-muted-foreground">Số lượng</div>

              <div className="font-medium">x{item.quantity}</div>
            </div>

            <div className="min-w-35 text-right">
              <div className="text-muted-foreground">Thành tiền</div>

              <div className="font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Sản phẩm đã đặt</h3>

        <p className="text-sm text-muted-foreground">
          {items.length} sản phẩm trong đơn hàng
        </p>
      </div>

      {shouldScroll ? (
        <ScrollArea className="h-140 rounded-lg border">
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
