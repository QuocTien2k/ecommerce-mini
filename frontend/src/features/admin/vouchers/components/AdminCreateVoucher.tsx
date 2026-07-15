import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { getCategoryDisplayName } from "@/utils/category/category-display-name";
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
import { getErrorMessage } from "@lib/error-message";
import { sonnerToast } from "@lib/sonner-toast";
import { X } from "lucide-react";
import { AdminProductSelector } from "./AdminProductSelector";
import { useAdminCreateVoucherForm } from "../forms/use-admin-create-voucher-form";
import { useAdminCreateVoucher } from "../hooks/useAdminCreateVoucher";
import { useAdminFlatCategoriesQuery } from "@features/admin/categories/hooks/useAdminCategoryFlatQuery";
import type { CreateVoucherFormOutput } from "../schema/admin-voucher";
import {
  VOUCHER_SCOPES,
  VOUCHER_TARGETS,
  VOUCHER_TYPES,
  type VoucherScope,
  type VoucherTarget,
  type VoucherType,
} from "@shared/types/voucher";
import type { CreateVoucherPayload } from "../types/admin-voucher.type";

type CreateVoucherFormProps = {
  open: boolean;
  onClose: () => void;
};

export const AdminCreateVoucher = ({
  open,
  onClose,
}: CreateVoucherFormProps) => {
  const form = useAdminCreateVoucherForm();
  const type = form.watch("type");

  const { loading, run } = useScopedLoading();

  const createVoucherMutation = useAdminCreateVoucher();
  const flatCategoriesQuery = useAdminFlatCategoriesQuery();
  const selectableCategories =
    flatCategoriesQuery.data?.data.filter((category) => category.level !== 1) ??
    [];
  const selectedCategoryIds = form.watch("categoryIds") ?? [];

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
          target: values.target,

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
                {type === VOUCHER_TYPES.FIXED
                  ? "Nhập số tiền muốn giảm. Ví dụ: 50000"
                  : "Nhập phần trăm giảm. Ví dụ: 20 nghĩa là giảm 20%"}
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

                <span className="text-xs text-muted-foreground">
                  {type === VOUCHER_TYPES.FIXED
                    ? "Voucher giảm cố định không cần giới hạn giảm tối đa."
                    : "Nhập số tiền giảm tối đa. Ví dụ: 100000 nghĩa là giảm nhiều nhất 100.000đ."}
                </span>

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

            {form.watch("scope") === VOUCHER_SCOPES.PRODUCT && (
              <AdminProductSelector
                value={form.watch("productIds") ?? []}
                onChange={(value) =>
                  form.setValue("productIds", value, {
                    shouldValidate: true,
                  })
                }
              />
            )}

            {/* CATEGORY SELECT */}
            {form.watch("scope") === VOUCHER_SCOPES.CATEGORY && (
              <div className="space-y-3">
                <Label>Danh mục áp dụng</Label>

                <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-3">
                  {selectableCategories.map((category) => {
                    const selected =
                      selectedCategoryIds?.includes(category.id) ?? false;

                    return (
                      <label
                        key={category.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Checkbox
                          checked={selected}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("categoryIds") ?? [];

                            if (checked) {
                              form.setValue(
                                "categoryIds",
                                [...current, category.id],
                                {
                                  shouldValidate: true,
                                },
                              );
                            } else {
                              form.setValue(
                                "categoryIds",
                                current.filter((id) => id !== category.id),
                                {
                                  shouldValidate: true,
                                },
                              );
                            }
                          }}
                        />

                        <span className="text-sm">
                          {"—".repeat(category.level - 1)}
                          {getCategoryDisplayName(category.name)}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <FieldError error={form.formState.errors.categoryIds} />
              </div>
            )}

            {/* Target  */}
            <div className="space-y-2">
              <Label>Đối tượng áp dụng</Label>

              <Select
                value={form.watch("target")}
                onValueChange={(value) =>
                  form.setValue("target", value as VoucherTarget)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đối tượng" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={VOUCHER_TARGETS.GLOBAL}>
                    Công khai
                  </SelectItem>

                  <SelectItem value={VOUCHER_TARGETS.PERSONAL}>
                    Cá nhân
                  </SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">
                {form.watch("target") === VOUCHER_TARGETS.GLOBAL
                  ? "Mọi người dùng đều có thể sử dụng voucher này."
                  : "Voucher chỉ sử dụng được sau khi được gán cho người dùng."}
              </span>
              <FieldError error={form.formState.errors.target} />
            </div>
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
