import type { PublicProductListQueryParams } from "../types/public-product.type";

export const PUBLIC_PRODUCT_QUERY_KEY = {
  all: ["public-product"] as const,

  home: () => [...PUBLIC_PRODUCT_QUERY_KEY.all, "home"] as const,

  list: (params?: PublicProductListQueryParams) =>
    [
      ...PUBLIC_PRODUCT_QUERY_KEY.all,
      "list",
      {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
        categoryId: params?.categoryId,
        brandId: params?.brandId,
        priceSort: params?.priceSort ?? "",
      },
    ] as const,

  detail: (slug: string) =>
    [...PUBLIC_PRODUCT_QUERY_KEY.all, "detail", slug] as const,

  related: (slug: string) =>
    [...PUBLIC_PRODUCT_QUERY_KEY.all, "related", slug] as const,

  searchPreview: (keyword: string) =>
    [...PUBLIC_PRODUCT_QUERY_KEY.all, "search-preview", keyword] as const,
};
