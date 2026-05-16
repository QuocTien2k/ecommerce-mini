export type AdminProductVariant = {
  id: string;

  color: string;

  attributes?: {
    size?: string;
  };

  attributesHash: string;

  images: string[];

  imagePublicIds: string[];

  stock: number;

  createdAt: string;
  updatedAt: string;
};

export type AdminCreateVariantPayload = {
  productId: string;

  color: string;

  attributes?: Record<string, string>;

  stock?: number;
};

export type AdminUpdateVariantPayload = {
  color?: string;

  attributes?: Record<string, string | number>;

  stock?: number;

  removeImagePublicIds?: string[];
};

export type AdminVariantResponse = {
  id: string;

  productId: string;

  color: string;

  attributes: Record<string, string | number>;

  attributesHash: string;

  images: string[];
  imagePublicIds: string[];

  stock: number;

  createdAt: string;
  updatedAt: string;
};

export type AdminCreateVariantResponse = AdminVariantResponse;

export type AdminUpdateVariantResponse = AdminVariantResponse;
