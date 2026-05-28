import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { FieldError } from "@components/ui/field-error";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useAdminUpdateVoucherForm } from "@features/vouchers/forms/use-admin-update-voucher-form";
import { useAdminUpdateVoucher } from "@features/vouchers/hooks/admin/useAdminUpdateVoucher";
import type { UpdateVoucherFormOutput } from "@features/vouchers/schema/admin-voucher";
import {
  VOUCHER_SCOPES,
  VOUCHER_TYPES,
  type AdminVoucher,
  type UpdateVoucherPayload,
} from "@features/vouchers/types/admin-voucher.type";
import { getErrorMessage } from "@lib/error";
import { sonnerToast } from "@lib/sonner-toast";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import { CircleCheckBig, CircleX, X } from "lucide-react";
import { useEffect } from "react";

type UpdateVoucherFormProps = {
  open: boolean;

  voucher: AdminVoucher | null;

  onClose: () => void;
};

export const AdminUpdateVoucher = ({
  open,
  voucher,
  onClose,
}: UpdateVoucherFormProps) => {
  const form = useAdminUpdateVoucherForm();

  const { loading, run } = useScopedLoading();

  const updateVoucherMutation = useAdminUpdateVoucher();

  useEffect(() => {
    if (!voucher || !open) return;

    form.reset({
      isActive: voucher.isActive,

      usageLimit: voucher.usageLimit ?? undefined,

      minOrderValue: voucher.minOrderValue
        ? Number(voucher.minOrderValue)
        : undefined,

      startAt: voucher.startAt
        ? format(new Date(voucher.startAt), "yyyy-MM-dd'T'HH:mm")
        : "",

      endAt: voucher.endAt
        ? format(new Date(voucher.endAt), "yyyy-MM-dd'T'HH:mm")
        : "",
    });
  }, [voucher, open, form]);

  const handleClose = () => {
    form.reset();
    form.clearErrors();

    onClose();
  };

  const onSubmit = form.handleSubmit(
    async (values: UpdateVoucherFormOutput) => {
      if (!voucher || loading) return;

      sonnerToast.dismiss("voucher-update-error");

      try {
        const payload: UpdateVoucherPayload = {
          isActive: values.isActive,

          usageLimit: values.usageLimit,

          minOrderValue: values.minOrderValue,

          startAt: values.startAt || undefined,

          endAt: values.endAt || undefined,
        };

        const result = await run(() =>
          updateVoucherMutation.mutateAsync({
            id: voucher.id,
            data: payload,
          }),
        );

        handleClose();

        sonnerToast.success(result.message);
      } catch (error) {
        console.error("Update voucher error:", error);

        sonnerToast.error(getErrorMessage(error, "Cập nhật voucher thất bại"), {
          id: "voucher-update-error",
        });
      }
    },
  );

  if (!open || !voucher) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cập nhật voucher</h2>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Code */}
            <div className="space-y-2">
              <Label>Mã voucher</Label>

              <Input value={voucher.code} disabled />

              <span className="text-xs text-muted-foreground">
                Không thể thay đổi mã voucher sau khi tạo.
              </span>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Loại voucher</Label>

              <Input
                value={
                  voucher.type === VOUCHER_TYPES.PERCENT
                    ? "Phần trăm"
                    : "Giảm cố định"
                }
                disabled
              />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label>Giá trị</Label>

              <Input value={voucher.value} disabled />
            </div>

            {/* Max discount */}
            {voucher.type === VOUCHER_TYPES.PERCENT && (
              <div className="space-y-2">
                <Label>Giảm tối đa</Label>

                <Input value={voucher.maxDiscount ?? ""} disabled />
              </div>
            )}

            {/* Min order */}
            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Đơn tối thiểu</Label>

              <Input
                id="minOrderValue"
                type="number"
                min={0}
                {...form.register("minOrderValue", {
                  valueAsNumber: true,
                })}
              />

              <FieldError error={form.formState.errors.minOrderValue} />
            </div>

            {/* Usage limit */}
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>

              <Input
                id="usageLimit"
                type="number"
                min={1}
                {...form.register("usageLimit", {
                  valueAsNumber: true,
                })}
              />

              <FieldError error={form.formState.errors.usageLimit} />
            </div>

            {/* Scope */}
            <div className="space-y-2">
              <Label>Phạm vi áp dụng</Label>

              <Input
                value={
                  voucher.scope === VOUCHER_SCOPES.ORDER
                    ? "Toàn đơn hàng"
                    : voucher.scope === VOUCHER_SCOPES.PRODUCT
                      ? "Theo sản phẩm"
                      : "Theo danh mục"
                }
                disabled
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>

              <div
                className={cn(
                  "flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium",
                  voucher.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700",
                )}
              >
                {voucher.isActive ? (
                  <CircleCheckBig className="size-4" />
                ) : (
                  <CircleX className="size-4" />
                )}

                <span>{voucher.isActive ? "Đang bật" : "Đang tắt"}</span>
              </div>
            </div>
          </div>

          {/* Start */}
          <div className="space-y-2">
            <Label htmlFor="startAt">Bắt đầu</Label>

            <Input
              id="startAt"
              type="datetime-local"
              {...form.register("startAt")}
            />

            <FieldError error={form.formState.errors.startAt} />
          </div>

          {/* End */}
          <div className="space-y-2">
            <Label htmlFor="endAt">Kết thúc</Label>

            <Input
              id="endAt"
              type="datetime-local"
              {...form.register("endAt")}
            />

            <FieldError error={form.formState.errors.endAt} />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3 pt-8">
            <Checkbox
              checked={form.watch("isActive")}
              onCheckedChange={(checked) =>
                form.setValue("isActive", !!checked)
              }
              className="
                cursor-pointer
                border-emerald-500
                data-[state=checked]:border-emerald-500
                data-[state=checked]:bg-emerald-500
                data-[state=checked]:text-white
              "
            />

            <Label>Kích hoạt voucher</Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="destructive"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>

            <AsyncButton type="submit" loading={loading} disabled={loading}>
              Cập nhật voucher
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
};
