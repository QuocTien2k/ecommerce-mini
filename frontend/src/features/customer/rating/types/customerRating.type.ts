export interface Rating {
  id: string;
  productId: string;
  userId: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}
/* Case create */
export interface CreateRatingPayload {
  productId: string;
  value: number;
}

/* Case update */
export interface UpdateRatingPayload {
  value: number;
}
