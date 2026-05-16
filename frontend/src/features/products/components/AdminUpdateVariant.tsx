// import { useScopedLoading } from "@/hooks/use-scoped-loading";
// import { useUpdateVariantForm } from "../forms/use-update-vairant-form";
// import { useEffect, useRef, useState } from "react";
// import { Button } from "@components/ui/button";
// import { ImagePlus, X } from "lucide-react";
// import { sonnerToast } from "@lib/sonner-toast";
// import { useAdminUpdateVariant } from "../hooks/useAdminUpdateVariant";
// import { getErrorMessage } from "@lib/error";
// import { Input } from "@components/ui/input";
// import { Label } from "@components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@components/ui/select";
// import { cn } from "@lib/utils";
// import { AsyncButton } from "@components/common/async-button";
// import { Checkbox } from "@components/ui/checkbox";
// import type { AdminProductVariant } from "../types/admin-variant.type";

// type UpdateVariantFormProps = {
//   open: boolean;
//   onClose: () => void;

//   variant: AdminProductVariant | null;
// };

// export const AdminUpdateVariant = ({
//   open,
//   onClose,
//   variant,
// }: UpdateVariantFormProps) => {
//   const form = useUpdateVariantForm();

//   const { loading, run } = useScopedLoading();

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   const updateProductVariant = useAdminUpdateVariant();

//   // watch files
//   const selectedFiles = form.watch("files");

//   // preview first image
//   useEffect(() => {
//     if (!selectedFiles?.length) {
//       setPreviewUrl(null);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(selectedFiles[0]);

//     setPreviewUrl(objectUrl);

//     return () => {
//       URL.revokeObjectURL(objectUrl);
//     };
//   }, [selectedFiles]);

//   useEffect(() => {
//     if (!variant || !open) return;

//     form.reset({
//       color: variant.color,

//       stock: variant.stock,

//       attributes: {
//         size: variant.attributes?.size || "",
//       },

//       files: [],

//       removeImagePublicIds: [],
//     });
//   }, [variant, open, form]);

//   const handleClose = () => {
//     form.reset();
//     form.clearErrors();
//     setPreviewUrl(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     onClose();
//   };

//   const onUpdate = form.handleSubmit(async (values) => {
//     if (!variant?.id || loading) return;

//     sonnerToast.dismiss("product-update-variant-error");

//     try {
//       const result = await run(() =>
//         updateProductVariant.mutateAsync({
//           id: variant.id,

//           data: {
//             color: values.color,
//             stock: values.stock,
//             attributes: values.attributes,
//             removeImagePublicIds: values.removeImagePublicIds,
//           },

//           files: values.files,
//         }),
//       );

//       handleClose();
//       sonnerToast.success(result.message);
//     } catch (error) {
//       console.error("Update product variant error:", error);

//       sonnerToast.error(getErrorMessage(error, "Cập nhật sản phẩm thất bại"), {
//         id: "product-update-variant-error",
//       });
//     }
//   });

//   if (!open || !variant?.id) return null;

//   return (
//     <div
//       className="
//       fixed inset-0 z-50
//       flex items-center justify-center
//       bg-black/30
//       backdrop-blur-sm
//       p-4
//     "
//       onClick={handleClose}
//     >
//       <div
//         className="
//         max-h-[95vh] w-full max-w-4xl overflow-y-auto
//         rounded-2xl border bg-background
//         p-6 shadow-2xl
//       "
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div className="space-y-1">
//             <h2 className="text-xl font-semibold">Cập nhật variant</h2>

//             <p className="text-sm text-muted-foreground">
//               Chỉnh sửa thông tin variant sản phẩm
//             </p>
//           </div>

//           <Button
//             type="button"
//             variant="destructive"
//             size="icon"
//             onClick={handleClose}
//           >
//             <X className="size-4" />
//           </Button>
//         </div>

//         <form onSubmit={onUpdate} className="space-y-6">
//           {/* variant info */}
//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             {/* color */}
//             <div className="space-y-2">
//               <Label>Màu sắc</Label>

//               <Input
//                 placeholder="Ví dụ: Đen, Trắng..."
//                 {...form.register("color")}
//               />

//               {form.formState.errors.color && (
//                 <p className="text-sm text-red-500">
//                   {form.formState.errors.color.message}
//                 </p>
//               )}
//             </div>

//             {/* size */}
//             <div className="space-y-2">
//               <Label>Size</Label>

//               <Select
//                 value={String(form.watch("attributes.size") || "")}
//                 onValueChange={(value) =>
//                   form.setValue("attributes.size", value, {
//                     shouldValidate: true,
//                   })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Chọn size" />
//                 </SelectTrigger>

//                 <SelectContent>
//                   <SelectItem value="S">S</SelectItem>
//                   <SelectItem value="M">M</SelectItem>
//                   <SelectItem value="L">L</SelectItem>
//                   <SelectItem value="XL">XL</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* stock */}
//             <div className="space-y-2">
//               <Label>Tồn kho</Label>

//               <Input
//                 type="number"
//                 min={0}
//                 placeholder="0"
//                 {...form.register("stock")}
//               />

//               {form.formState.errors.stock && (
//                 <p className="text-sm text-red-500">
//                   {form.formState.errors.stock.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* current images */}
//           <div className="space-y-3">
//             <div className="space-y-1">
//               <Label>Ảnh hiện tại</Label>

//               <p className="text-xs text-muted-foreground">
//                 Chọn ảnh muốn xoá khỏi variant
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
//               {variant.images.map((image, index) => {
//                 const publicId = variant.imagePublicIds[index];

//                 const removedImages = form.watch("removeImagePublicIds") || [];

//                 const checked = removedImages.includes(publicId);

//                 return (
//                   <div
//                     key={publicId}
//                     className="relative overflow-hidden rounded-xl border"
//                   >
//                     <img
//                       src={image}
//                       alt={variant.color}
//                       className={cn(
//                         "aspect-3/4 h-full w-full object-cover transition",
//                         checked && "opacity-40",
//                       )}
//                     />

//                     <div className="absolute right-2 top-2">
//                       <Checkbox
//                         checked={checked}
//                         onCheckedChange={(value) => {
//                           const current =
//                             form.getValues("removeImagePublicIds") || [];

//                           if (value) {
//                             form.setValue("removeImagePublicIds", [
//                               ...current,
//                               publicId,
//                             ]);
//                           } else {
//                             form.setValue(
//                               "removeImagePublicIds",
//                               current.filter((id) => id !== publicId),
//                             );
//                           }
//                         }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* upload new images */}
//           <div className="space-y-3">
//             <Label>Thêm ảnh mới</Label>

//             <input
//               ref={fileInputRef}
//               id="variant-image"
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={(e) => {
//                 const files = Array.from(e.target.files || []);

//                 form.setValue("files", files, {
//                   shouldValidate: true,
//                 });
//               }}
//             />

//             <div className="flex items-center gap-4">
//               <Label
//                 htmlFor="variant-image"
//                 className="
//           flex size-28 cursor-pointer items-center justify-center
//           overflow-hidden rounded-lg border border-dashed
//           bg-muted transition hover:bg-muted/80
//         "
//               >
//                 {previewUrl ? (
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center gap-1 text-muted-foreground">
//                     <ImagePlus className="size-6" />
//                   </div>
//                 )}
//               </Label>

//               <div className="space-y-1">
//                 <Label
//                   htmlFor="variant-image"
//                   className="
//             cursor-pointer text-sm font-medium
//             text-blue-500 hover:underline
//           "
//                 >
//                   Chọn ảnh mới
//                 </Label>

//                 <p className="text-xs text-muted-foreground">
//                   PNG, JPG, WEBP - tối đa 5MB
//                 </p>

//                 {!!selectedFiles?.length && (
//                   <div className="space-y-1">
//                     <p className="text-xs text-muted-foreground">
//                       Đã chọn {selectedFiles.length} ảnh
//                     </p>

//                     <p className="max-w-60 truncate text-xs text-muted-foreground">
//                       {selectedFiles[0].name}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {form.formState.errors.files && (
//               <p className="text-sm text-red-500">
//                 {form.formState.errors.files.message}
//               </p>
//             )}
//           </div>

//           {/* actions */}
//           <div className="flex items-center justify-end gap-3 border-t pt-4">
//             <Button type="button" variant="outline" onClick={handleClose}>
//               Hủy
//             </Button>

//             <AsyncButton loading={loading} disabled={loading}>
//               Cập nhật variant
//             </AsyncButton>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
