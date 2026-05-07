import type { ApiResponse } from "./api-response";

export type ApiResult<T = unknown> = Promise<ApiResponse<T>>;
