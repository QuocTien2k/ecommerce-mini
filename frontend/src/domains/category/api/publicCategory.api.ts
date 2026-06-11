import { api } from "@shared/api/axios";
import type { ApiResult } from "@shared/types/api-result";
import type { PublicCategoryTreeItem } from "../types/public-category.type";

export const publicCategoryApi = {
  getTree: (): ApiResult<PublicCategoryTreeItem[]> => api.get("/categories"),
};
