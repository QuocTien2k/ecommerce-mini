import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ORDER_STATUS_GUIDE } from "../types/order-status-guide.constant";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABEL,
} from "@shared/types/order-status.utils";

type OrderStatusGuideModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function OrderStatusGuideModal({
  open,
  onOpenChange,
}: OrderStatusGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Hướng dẫn cập nhật trạng thái đơn hàng</DialogTitle>

          <DialogDescription>
            Admin chỉ được cập nhật trạng thái theo đúng quy trình. Nếu chọn
            trạng thái không hợp lệ, hệ thống sẽ từ chối cập nhật.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-90px)] px-6 pb-6">
          <div className="space-y-5">
            {ORDER_STATUS_GUIDE.map((item) => (
              <div
                key={item.currentStatus}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Trạng thái hiện tại
                  </span>

                  <Badge
                    className={ORDER_STATUS_COLORS[item.currentStatus]}
                    variant="secondary"
                  >
                    {ORDER_STATUS_LABEL[item.currentStatus]}
                  </Badge>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Có thể chuyển sang
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {item.nextStatuses.length > 0 ? (
                      item.nextStatuses.map((status) => (
                        <Badge
                          key={status}
                          className={ORDER_STATUS_COLORS[status]}
                          variant="secondary"
                        >
                          {ORDER_STATUS_LABEL[status]}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Không thể cập nhật thêm.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">Lưu ý</p>

              <ul className="list-disc pl-5 space-y-1">
                <li>Đơn hàng phải được cập nhật theo đúng trình tự.</li>
                <li>
                  Có thể hủy đơn ở các trạng thái: Đã đặt hàng, Đã xác nhận và
                  Đang xử lý.
                </li>
                <li>
                  Khi đơn hàng đã giao thành công hoặc đã hủy thì không thể cập
                  nhật sang trạng thái khác.
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
