import { useState } from "react";
import { useCreateCategoryMutation } from "../hooks/useAdminCreateCategory";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { useCreateCategoryForm } from "../forms/use-create-category-form";
import { useAdminFlatCategoriesQuery } from "../hooks/useAdminCategoryFlatQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { X } from "lucide-react";
import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { AsyncButton } from "@components/common/async-button";
import { toSlug } from "@/utils/toSlug";

type CreateCategoryFormProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateCategoryForm = ({
  open,
  onClose,
}: CreateCategoryFormProps) => {
  const form = useCreateCategoryForm();
  const { loading, run } = useScopedLoading();

  //preview slug
  const categoryName = form.watch("name");

  const createCategoryMutation = useCreateCategoryMutation();

  const flatCategoriesQuery = useAdminFlatCategoriesQuery();

  const onSubmit = form.handleSubmit(async (values) => {
    if (loading) return;

    sonnerToast.dismiss("category-create-error");

    try {
      const result = await run(
        () =>
          createCategoryMutation.mutateAsync({
            data: {
              name: values.name,

              description: values.description,

              parentId: values.parentId || undefined,

              isActive: values.isActive,
            },

            file: values.file,
          }),
        {
          minDuration: 500,
        },
      );

      form.reset();
      onClose();

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Create category error:", error);
      sonnerToast.error(getErrorMessage(error, "Tạo danh mục thất bại"), {
        id: "category-create-error",
      });
    }
  });

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        backdrop-blur-sm
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-2xl
          rounded-2xl
          border border-white/10
          bg-white
          p-6
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tạo danh mục</h2>

          <Button variant="destructive" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Tên danh mục</Label>

            <Input
              placeholder="Nhập tên danh mục..."
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}

            {categoryName && (
              <p className="text-[14px] text-blue-500 text-shadow-blue-800">
                Slug preview: {toSlug(categoryName)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>

            <Textarea
              placeholder="Mô tả danh mục..."
              {...form.register("description")}
            />

            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Danh mục cha</Label>

            <Select onValueChange={(value) => form.setValue("parentId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cha" />
              </SelectTrigger>

              <SelectContent>
                {flatCategoriesQuery.data?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.parentId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.parentId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ảnh</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                form.setValue("file", file!, {
                  shouldValidate: true,
                });
              }}
            />

            {form.formState.errors.file && (
              <p className="text-sm text-red-500">
                {form.formState.errors.file.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={form.watch("isActive")}
              onCheckedChange={(checked) =>
                form.setValue("isActive", Boolean(checked))
              }
            />

            <Label>Hiển thị danh mục</Label>
          </div>

          <AsyncButton type="submit" loading={loading} disabled={loading}>
            Tạo danh mục
          </AsyncButton>
        </form>
      </div>
    </div>
  );
};
