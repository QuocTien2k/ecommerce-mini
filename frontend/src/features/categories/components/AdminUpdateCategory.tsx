import { useScopedLoading } from "@/hooks/use-scoped-loading";
import { useUpdateCategoryForm } from "../forms/use-update-category-form";
import { VARIANT_TYPES, type VariantType } from "../types/admin-category.type";
import { useEffect, useRef, useState } from "react";
import { useUpdateCategoryMutation } from "../hooks/useAdminUpdateCategory";
import { useAdminFlatCategoriesQuery } from "../hooks/useAdminCategoryFlatQuery";
import { sonnerToast } from "@lib/sonner-toast";
import { getErrorMessage } from "@lib/error";
import { Button } from "@components/ui/button";
import { ImagePlus, Info, X, ArrowRight } from "lucide-react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { AsyncButton } from "@components/common/async-button";
import {
  variantTypeOptions,
  variantTypeLabels,
} from "@shared/types/variant-type";
import { useWatch } from "react-hook-form";
import { useAdminCategoryDetailQuery } from "../hooks/useAdminCategoryDetail";
import { getCategoryContextLabel } from "@/utils/category/get-category-context";

type UpdateCategoryFormProps = {
  open: boolean;
  onClose: () => void;
  categoryId?: string;
};

export const UpdateCategoryForm = ({
  open,
  onClose,
  categoryId,
}: UpdateCategoryFormProps) => {
  if (!open || !categoryId) return null;

  const form = useUpdateCategoryForm();

  const { loading, run } = useScopedLoading();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitializingRef = useRef(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const updateMutation = useUpdateCategoryMutation();
  const flatCategoriesQuery = useAdminFlatCategoriesQuery();
  const categoryDetailQuery = useAdminCategoryDetailQuery(
    open ? categoryId : undefined,
  );
  const detail = categoryDetailQuery.data?.data;
  const categoryContext = detail
    ? getCategoryContextLabel({
        level: detail.level,
        parentName: detail.parentName,
      })
    : null;

  const selectedFile = form.watch("file");

  const parentId = useWatch({
    control: form.control,
    name: "parentId",
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  const variantType = useWatch({
    control: form.control,
    name: "variantType",
  });

  const selectedParent = flatCategoriesQuery.data?.data.find(
    (item) => item.id === parentId,
  );

  const isVariantLocked = detail ? !detail.canChangeVariantType : false;
  const isReady =
    open &&
    !!categoryId &&
    flatCategoriesQuery.isSuccess &&
    categoryDetailQuery.isSuccess;

  // console.log(categoryId);
  // console.log(categoryDetailQuery.data?.data.id);

  // Đồng bộ variantType theo danh mục cha.
  useEffect(() => {
    if (isInitializingRef.current) return;
    if (!selectedParent) return;

    form.setValue("variantType", selectedParent.variantType, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedParent, form]);

  //  init form change or open
  useEffect(() => {
    if (!isReady) return;

    const detail = categoryDetailQuery.data?.data;

    if (!detail) return;

    isInitializingRef.current = true;
    setIsFormReady(false);

    form.reset({
      name: detail.name,
      description: detail.description ?? "",
      parentId: detail.parentId ?? undefined,
      isActive: detail.isActive,
      variantType: detail.variantType,
      file: undefined,
    });

    setPreviewUrl(detail.image);

    queueMicrotask(() => {
      isInitializingRef.current = false;
      setIsFormReady(true);
    });
  }, [isReady, categoryDetailQuery.data, form]);

  // file preview
  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleClose = () => {
    isInitializingRef.current = false;
    form.reset();
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!categoryId || loading) return;

    try {
      const result = await run(
        () =>
          updateMutation.mutateAsync({
            id: categoryId,
            data: {
              name: values.name,
              description: values.description,
              parentId: values.parentId || undefined,
              isActive: values.isActive,
              variantType: values.variantType,
            },
            file: values.file,
          }),
        {
          minDuration: 500,
        },
      );

      handleClose();

      sonnerToast.success(result.message);
    } catch (error) {
      console.error("Update category error:", error);
      sonnerToast.error(getErrorMessage(error, "Cập nhật danh mục thất bại"), {
        id: "category-update-error",
      });
    }
  });

  console.log("Chi tiết: ", detail);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cập nhật danh mục</h2>

          <Button variant="destructive" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/*Info */}
        <div className="mb-4 rounded-xl border border-muted bg-muted/40 p-3 shadow-sm">
          <div className="flex gap-3">
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <Info className="h-5 w-5 text-indigo-500" />
              <div className="mt-1 h-full w-px bg-muted" />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {categoryContext?.label || "Không có tiêu đề"}
              </p>

              <p className="text-xs text-muted-foreground flex items-center gap-2 leading-relaxed">
                <ArrowRight className="h-5 w-5 shrink-0 text-orange-500" />
                <span>
                  <span className="font-medium text-foreground">Gợi ý:</span>{" "}
                  {categoryContext?.description || "Không có mô tả"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* NAME */}
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
          </div>

          {/* DESCRIPTION */}
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

          {/* PARENT */}
          <div className="space-y-2">
            <Label>Danh mục cha</Label>

            <Select
              value={parentId || "none"}
              onValueChange={(value) => {
                const nextParentId = value === "none" ? undefined : value;

                form.setValue("parentId", nextParentId);

                if (value === "none") {
                  form.setValue("variantType", VARIANT_TYPES.NONE);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cha" />
              </SelectTrigger>

              <SelectContent
                className="max-h-72 p-2 text-black/50"
                position="popper"
              >
                <SelectItem value="none">Không có danh mục cha</SelectItem>
                {flatCategoriesQuery.data?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {`${"".repeat(category.level - 1)}${category.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* {Loại variant} */}
          <div className="space-y-2">
            <Label>Loại variant</Label>
            {isFormReady && (
              <Select
                value={variantType}
                disabled={isVariantLocked || !!selectedParent}
                onValueChange={(value) =>
                  form.setValue("variantType", value as VariantType, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại variant" />
                </SelectTrigger>

                <SelectContent className="text-black/50" position="popper">
                  {variantTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* parent sync info */}
            {selectedParent && (
              <p className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-red-700">
                Variant type được đồng bộ theo danh mục cha:{" "}
                <span className="font-semibold">
                  {variantTypeLabels[selectedParent.variantType]}
                </span>
              </p>
            )}

            {/* locked info */}
            {isVariantLocked && !selectedParent && (
              <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                Không thể đổi variant type khi danh mục đã có sản phẩm hoặc danh
                mục con
              </p>
            )}

            {form.formState.errors.variantType && (
              <p className="text-sm text-red-500">
                {form.formState.errors.variantType.message}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div className="space-y-3">
            <Label>Ảnh danh mục</Label>

            <input
              id="category-image-update"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                form.setValue("file", file, {
                  shouldValidate: true,
                });
              }}
            />

            <div className="flex items-center gap-4">
              <Label
                htmlFor="category-image-update"
                className="flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted transition hover:bg-muted/80"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Category preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <ImagePlus className="size-5" />
                  </div>
                )}
              </Label>

              <div className="space-y-1">
                <Label
                  htmlFor="category-image-update"
                  className="cursor-pointer text-sm font-medium text-blue-500 hover:underline"
                >
                  Thay đổi ảnh
                </Label>

                {selectedFile && (
                  <p className="text-xs text-muted-foreground truncate max-w-56">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            {form.formState.errors.file && (
              <p className="text-sm text-red-500">
                {form.formState.errors.file.message}
              </p>
            )}
          </div>

          {/* ACTIVE */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) =>
                form.setValue("isActive", Boolean(checked))
              }
              className="cursor-pointer"
            />

            <Label>Hiển thị danh mục</Label>
          </div>

          <AsyncButton type="submit" loading={loading}>
            Cập nhật danh mục
          </AsyncButton>
        </form>
      </div>
    </div>
  );
};
