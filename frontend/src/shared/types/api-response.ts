export interface ApiResponse<T = unknown, M = any> {
  status: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: M;
  timestamp: string;
}
