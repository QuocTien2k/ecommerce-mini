const BASE = ["customer-ratings"] as const;

export const CUSTOMER_RATING_QUERY_KEY = {
  all: BASE,

  lists: () => [...BASE, "list"] as const,

  list: (productId: string) => [...BASE, "list", productId] as const,

  details: () => [...BASE, "detail"] as const,

  detail: (ratingId: string) => [...BASE, "detail", ratingId] as const,

  mine: (productId: string) => [...BASE, "mine", productId] as const,
};
