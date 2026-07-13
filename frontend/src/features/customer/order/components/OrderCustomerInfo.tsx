import type { AdminUser } from "@features/admin/user/types/adminUser.type";
import type { UseFormReturn } from "react-hook-form";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import type { OrderFormSchema } from "../schemas/order.schema";
import { Textarea } from "@components/ui/textarea";
import { FieldError } from "@components/ui/field-error";

interface OrderCustomerInfoProps {
  user: AdminUser | null;
  form: UseFormReturn<OrderFormSchema>;
}

const OrderCustomerInfo = ({ user, form }: OrderCustomerInfoProps) => {
  return (
    <div className="border rounded-md p-4 space-y-5">
      <h2 className="font-medium">Thông tin nhận hàng</h2>

      {/* Fullname */}
      <div className="space-y-2">
        <Label>Người nhận</Label>

        <Input value={user?.fullname ?? ""} disabled />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label>Số điện thoại</Label>

        <Input
          placeholder="Nhập số điện thoại..."
          {...form.register("receiverPhone")}
        />

        <FieldError error={form.formState.errors.receiverPhone} />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label>Địa chỉ nhận hàng</Label>

        <Input
          placeholder="Nhập địa chỉ nhận hàng..."
          {...form.register("receiverAddress")}
        />

        <FieldError error={form.formState.errors.receiverAddress} />
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label>Ghi chú</Label>

        <Textarea
          rows={3}
          maxLength={300}
          placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
          {...form.register("note")}
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tối đa 300 ký tự</span>
          <span>{form.watch("note")?.length ?? 0}/300</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
