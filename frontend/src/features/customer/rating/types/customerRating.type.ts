export interface Rating {
  id: string;
  productId: string;
  userId: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface RatingPayload {
  productId: string;
  value: number;
}
