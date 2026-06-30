export interface CreateRatingPayload {
  productId: string;
  value: number;
}

export interface Rating {
  id: string;
  productId: string;
  userId: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}
