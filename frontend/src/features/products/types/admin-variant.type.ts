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

export type AdminCreateVariantResponse = {
  id: string;

  productId: string;

  color: string;

  attributes: Record<string, string>;
  attributesHash: string;

  images: string[];
  imagePublicIds: string[];

  stock: number;

  createdAt: string;
  updatedAt: string;
};
