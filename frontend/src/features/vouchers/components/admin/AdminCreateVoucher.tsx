import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { AsyncButton } from "@components/common/async-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { FieldError } from "@components/ui/field-error";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { useAdminCreateVoucherForm } from "@features/vouchers/forms/use-admin-create-voucher-form";
import { useAdminCreateVoucher } from "@features/vouchers/hooks/admin/useAdminCreateVoucher";
import type { CreateVoucherFormOutput } from "@features/vouchers/schema/admin-voucher";
import {
  VOUCHER_SCOPES,
  VOUCHER_TYPES,
  type CreateVoucherPayload,
  type VoucherScope,
  type VoucherType,
} from "@features/vouchers/types/admin-voucher.type";
import { getErrorMessage } from "@lib/error";
import { sonnerToast } from "@lib/sonner-toast";
import { X } from "lucide-react";

type CreateVoucherFormProps = {
  open: boolean;
  onClose: () => void;
};

export const AdminCreateVoucher = ({
  open,
  onClose,
}: CreateVoucherFormProps) => {
  const form = useAdminCreateVoucherForm();

  const { loading, run } = useScopedLoading();

  const createVoucherMutation = useAdminCreateVoucher();

  const handleClose = () => {
    form.reset();
    form.clearErrors();

    onClose();
  };

  const onSubmit = form.handleSubmit(
    async (values: CreateVoucherFormOutput) => {
      if (loading) return;
      sonnerToast.dismiss("voucher-create-error");

      try {
        const payload: CreateVoucherPayload = {
          code: values.code,

          type: values.type,

          value: values.value,

          maxDiscount: values.maxDiscount,

          minOrderValue: values.minOrderValue,

          usageLimit: values.usageLimit,

          scope: values.scope,

          isActive: values.isActive,

          startAt: values.startAt,

          endAt: values.endAt,

          productIds:
            values.scope === VOUCHER_SCOPES.PRODUCT
              ? values.productIds
              : undefined,

          categoryIds:
            values.scope === VOUCHER_SCOPES.CATEGORY
              ? values.categoryIds
              : undefined,
        };

        // console.log("payload", payload);

        const result = await run(() =>
          createVoucherMutation.mutateAsync(payload),
        );

        handleClose();
        sonnerToast.success(result.message);
      } catch (error) {
        console.error("Create voucher error:", error);

        sonnerToast.error(getErrorMessage(error, "Tạo voucher thất bại"), {
          id: "voucher-create-error",
        });
      }
    },
  );

  if (!open) return null;

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
          <h2 className="text-lg font-semibold">Tạo voucher</h2>

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
            {/* Code voucher */}
            <div className="space-y-2">
              <Label htmlFor="code">Mã voucher</Label>

              <Input
                id="code"
                placeholder="SUMMER2026"
                {...form.register("code")}
              />

              <FieldError error={form.formState.errors.code} />
            </div>

            {/* Kind of voucher */}
            <div className="space-y-2">
              <Label>Loại voucher</Label>

              <Select
                value={form.watch("type")}
                onValueChange={(value) =>
                  form.setValue("type", value as VoucherType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại voucher" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={VOUCHER_TYPES.PERCENT}>
                    Phần trăm
                  </SelectItem>

                  <SelectItem value={VOUCHER_TYPES.FIXED}>
                    Giảm cố định
                  </SelectItem>
                </SelectContent>
              </Select>

              <FieldError error={form.formState.errors.type} />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label htmlFor="value">Giá trị</Label>

              <Input
                id="value"
                type="number"
                min={0}
                {...form.register("value", {
                  valueAsNumber: true,
                })}
              />

              <span className="text-xs text-muted-foreground">
                Voucher FIXED: nhập số tiền giảm. Voucher PERCENT: nhập phần
                trăm giảm.
              </span>

              <FieldError error={form.formState.errors.value} />
            </div>

            {form.watch("type") === VOUCHER_TYPES.PERCENT && (
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Giảm tối đa</Label>

                <Input
                  id="maxDiscount"
                  type="number"
                  min={0}
                  {...form.register("maxDiscount", {
                    valueAsNumber: true,
                  })}
                />

                <FieldError error={form.formState.errors.maxDiscount} />
              </div>
            )}

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

            {/* Limit */}
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

              <Select
                value={form.watch("scope")}
                onValueChange={(value) =>
                  form.setValue("scope", value as VoucherScope)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phạm vi" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={VOUCHER_SCOPES.ORDER}>
                    Toàn đơn hàng
                  </SelectItem>

                  <SelectItem value={VOUCHER_SCOPES.PRODUCT}>
                    Theo sản phẩm
                  </SelectItem>

                  <SelectItem value={VOUCHER_SCOPES.CATEGORY}>
                    Theo danh mục
                  </SelectItem>
                </SelectContent>
              </Select>

              <FieldError error={form.formState.errors.scope} />
            </div>

            {/* Time start */}
            <div className="space-y-2">
              <Label htmlFor="startAt">Bắt đầu</Label>

              <Input
                id="startAt"
                type="datetime-local"
                {...form.register("startAt")}
              />

              <FieldError error={form.formState.errors.startAt} />
            </div>

            {/* Time end */}
            <div className="space-y-2">
              <Label htmlFor="endAt">Kết thúc</Label>

              <Input
                id="endAt"
                type="datetime-local"
                {...form.register("endAt")}
              />

              <FieldError error={form.formState.errors.endAt} />
            </div>
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

            <Label>Kích hoạt ngay</Label>
          </div>

          {form.watch("scope") === VOUCHER_SCOPES.PRODUCT && (
            <div className="space-y-2">
              <Label htmlFor="productIds">Danh sách productIds</Label>

              <Textarea
                id="productIds"
                placeholder="product-id-1, product-id-2"
                onChange={(e) => {
                  const values = e.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);

                  form.setValue("productIds", values);
                }}
              />

              <FieldError error={form.formState.errors.productIds} />
            </div>
          )}

          {form.watch("scope") === VOUCHER_SCOPES.CATEGORY && (
            <div className="space-y-2">
              <Label htmlFor="categoryIds">Danh sách categoryIds</Label>

              <Textarea
                id="categoryIds"
                placeholder="category-id-1, category-id-2"
                onChange={(e) => {
                  const values = e.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);

                  form.setValue("categoryIds", values);
                }}
              />

              <FieldError error={form.formState.errors.categoryIds} />
            </div>
          )}

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
              Tạo voucher
            </AsyncButton>
          </div>
        </form>
      </div>
    </div>
  );
};
