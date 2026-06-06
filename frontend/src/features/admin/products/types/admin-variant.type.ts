export interface AdminVariantAttributes {
  [key: string]: string | number;
}

export interface AdminCreateVariantPayload {
  productId: string;
  color: string;
  attributes?: AdminVariantAttributes;
  stock?: number;
  imageUrls?: string[];
}

export interface AdminUpdateVariantPayload {
  color?: string;

  attributes?: AdminVariantAttributes;

  stock?: number;

  removeImagePublicIds?: string[];
  imageUrls?: string[];
}

export interface AdminVariantResponse {
  id: string;

  productId: string;
  color: string;

  attributes: AdminVariantAttributes | null;
  attributesHash: string | null;

  images: string[];
  imagePublicIds: string[];

  stock: number;

  createdAt: string;
  updatedAt: string;
}

export type AdminCreateVariantResponse = AdminVariantResponse;

export type AdminUpdateVariantResponse = AdminVariantResponse;
