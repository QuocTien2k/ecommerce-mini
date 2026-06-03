import { Button } from "@components/ui/button";
import type { AdminVariantResponse } from "../types/admin-variant.type";
import { ImagePlus, Trash2, Undo2 } from "lucide-react";
import { Input } from "@components/ui/input";

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

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);

    onFilesChange(selected);
  };

  const urls = imageUrls && imageUrls.length > 0 ? imageUrls : variant.images;
  const MAX_IMAGES = 3;

  const canAddMore = urls.length < MAX_IMAGES;
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Hình ảnh biến thể</h3>

      {isCloudinaryVariant ? (
        <>
          {/* OLD IMAGES */}

          <div className="grid grid-cols-2 gap-4">
            {variant.images.map((image, index) => {
              const publicId = variant.imagePublicIds[index];

              const removed = removeImagePublicIds.includes(publicId);

              return (
                <div
                  key={publicId}
                  className="relative overflow-hidden rounded-lg border"
                >
                  <img
                    src={image}
                    alt=""
                    className={`h-40 w-full object-cover ${
                      removed ? "opacity-40" : ""
                    }`}
                  />

                  <div className="absolute right-2 top-2">
                    <Button
                      type="button"
                      size="icon"
                      variant={removed ? "secondary" : "destructive"}
                      onClick={() => toggleRemoveCloudinaryImage(publicId)}
                    >
                      {removed ? (
                        <Undo2 className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {removed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
                      Sẽ bị xóa
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* NEW FILES */}

          <div className="space-y-2">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
            />

            {files.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {files.map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="overflow-hidden rounded-lg border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
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
                  <div className="overflow-hidden rounded-md border">
                    <img
                      src={url}
                      alt={`variant-${index}`}
                      className="h-40 w-full object-cover"
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
