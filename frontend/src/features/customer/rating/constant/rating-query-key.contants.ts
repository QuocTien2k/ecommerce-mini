const BASE = ["customer-ratings"] as const;

export const CUSTOMER_RATING_QUERY_KEY = {
  all: BASE,

  mine: (productId: string) => [...BASE, "mine", productId] as const,
};
