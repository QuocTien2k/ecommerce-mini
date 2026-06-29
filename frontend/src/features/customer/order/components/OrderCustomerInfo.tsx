import type { AdminUser } from "@features/admin/user/types/adminUser.type";
import type { UseFormReturn } from "react-hook-form";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import type { OrderFormSchema } from "../schemas/order.schema";
import { Textarea } from "@components/ui/textarea";

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

        {form.formState.errors.receiverPhone && (
          <p className="text-sm text-red-500">
            {form.formState.errors.receiverPhone.message}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label>Địa chỉ nhận hàng</Label>

        <Input
          placeholder="Nhập địa chỉ nhận hàng..."
          {...form.register("receiverAddress")}
        />

        {form.formState.errors.receiverAddress && (
          <p className="text-sm text-red-500">
            {form.formState.errors.receiverAddress.message}
          </p>
        )}
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

        {form.formState.errors.note && (
          <p className="text-sm text-red-500">
            {form.formState.errors.note.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderCustomerInfo;
