import { Button } from "@components/ui/button";
import type { AdminVariantResponse } from "../types/admin-variant.type";
import { ImagePlus, Trash2, Undo2, UploadCloud } from "lucide-react";
import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";

type VariantUpdateImageManagerProps = {
  variant: AdminVariantResponse;

  files: File[];
  onFilesChange: (files: File[]) => void;

  imageUrls?: string[];
  onImageUrlsChange: (urls: string[]) => void;

  removeImagePublicIds: string[];
  onRemoveImagePublicIdsChange: (ids: string[]) => void;
};

export const VariantUpdateImageManager = ({
  variant,

  files,
  onFilesChange,

  imageUrls,
  onImageUrlsChange,

  removeImagePublicIds,
  onRemoveImagePublicIdsChange,
}: VariantUpdateImageManagerProps) => {
  const isCloudinaryVariant = variant.imagePublicIds.length > 0;

  const toggleRemoveCloudinaryImage = (publicId: string) => {
    const exists = removeImagePublicIds.includes(publicId);

    if (exists) {
      onRemoveImagePublicIdsChange(
        removeImagePublicIds.filter((id) => id !== publicId),
      );

      return;
    }

    onRemoveImagePublicIdsChange([...removeImagePublicIds, publicId]);
  };

  const urls = imageUrls ?? variant.images;

  const MAX_IMAGES = 2;

  const activeOldImages = variant.images.length - removeImagePublicIds.length;

  const currentImageCount = activeOldImages + files.length;

  const canAddMore = currentImageCount < MAX_IMAGES;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    const availableSlots = MAX_IMAGES - activeOldImages - files.length;

    if (availableSlots <= 0) {
      e.target.value = "";
      return;
    }

    const nextFiles = selectedFiles.slice(0, availableSlots);

    onFilesChange([...files, ...nextFiles]);

    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Hình ảnh biến thể</h3>

      {isCloudinaryVariant ? (
        <>
          {/* OLD IMAGES */}
          <div className="grid grid-cols-3 gap-3">
            {variant.images.map((image, index) => {
              const publicId = variant.imagePublicIds[index];
              const removed = removeImagePublicIds.includes(publicId);

              return (
                <div
                  key={publicId}
                  className="relative rounded-lg border bg-muted/20 p-2"
                >
                  <div className="flex justify-center">
                    <img
                      src={image}
                      alt=""
                      className={`h-24 w-24 object-contain transition-opacity ${
                        removed ? "opacity-40" : ""
                      }`}
                    />
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant={removed ? "secondary" : "destructive"}
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={() => toggleRemoveCloudinaryImage(publicId)}
                  >
                    {removed ? (
                      <Undo2 className="h-3.5 w-3.5" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>

                  {removed && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                      <span className="text-xs font-medium text-white">
                        Sẽ bị xóa
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* NEW FILES */}
          {/* NEW FILES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {currentImageCount}/{MAX_IMAGES} ảnh
              </span>

              {!canAddMore && (
                <span className="text-xs text-amber-600">
                  Đã đạt giới hạn ảnh
                </span>
              )}
            </div>

            <input
              id={`variant-images-${variant.id}`}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              className="hidden"
              disabled={!canAddMore}
            />

            <label
              htmlFor={canAddMore ? `variant-images-${variant.id}` : undefined}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
                canAddMore
                  ? "cursor-pointer bg-muted/30 hover:bg-muted/50"
                  : "cursor-not-allowed border-muted bg-muted/10 opacity-50",
              )}
            >
              <UploadCloud className="mb-2 h-6 w-6 text-muted-foreground" />

              <span className="text-sm font-medium">
                {canAddMore ? "Chọn ảnh mới" : "Không thể thêm ảnh"}
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                JPG, PNG, WEBP • Tối đa {MAX_IMAGES} ảnh
              </span>
            </label>

            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="relative rounded-lg border bg-muted/20 p-2"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() =>
                        onFilesChange(files.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>

                    <div className="flex justify-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="h-24 w-24 object-contain"
                      />
                    </div>

                    <p className="mt-2 truncate text-center text-xs text-muted-foreground">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            {urls.map((url, index) => (
              <div key={index} className="rounded-lg border p-3 space-y-3">
                {!!url && (
                  <div className="flex justify-center rounded-md border bg-muted/20 p-2">
                    <img
                      src={url}
                      alt={`variant-${index}`}
                      className="h-24 w-24 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const next = [...urls];
                      next[index] = e.target.value;

                      onImageUrlsChange(next);
                    }}
                    placeholder="https://..."
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const next = urls.filter((_, i) => i !== index);

                      onImageUrlsChange(next);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {urls.length}/{MAX_IMAGES} ảnh
            </span>

            <Button
              type="button"
              variant="outline"
              disabled={!canAddMore}
              onClick={() => {
                if (!canAddMore) return;

                onImageUrlsChange([...urls, ""]);
              }}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Thêm URL ảnh
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
