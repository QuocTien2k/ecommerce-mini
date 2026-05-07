import { store } from "@/app/store";
import { api, refreshClient } from "./axios";
import {
  clearAuth,
  setCredentials,
  setRefreshing,
} from "@/features/auth/auth.slice";

// let isRefreshing = false;
// let queue: Array<(token: string | null) => void> = [];
let refreshPromise: Promise<string | null> | null = null;

// const processQueue = (token: string | null) => {
//   queue.forEach((cb) => cb(token));
//   queue = [];
// };

export function setupInterceptors() {
  // REQUEST INTERCEPTOR
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;

    const noAuthRoutes = ["/auth/login", "/auth/refresh"];

    const isNoAuth = noAuthRoutes.some((r) => config.url?.includes(r));

    if (token && !isNoAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (response) => {
      const res = response.data;

      // ApiResponse
      if (res && typeof res === "object" && "status" in res) {
        if (!res.status) {
          return Promise.reject(res); // đẩy error xuống catch
        }
        return res;
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      const noRefreshRoutes = ["/auth/login", "/auth/refresh"];

      const isNoRefresh = noRefreshRoutes.some((url) =>
        originalRequest.url?.includes(url),
      );

      if (isNoRefresh) {
        return Promise.reject(error);
      }

      //xử lý 401 và chưa retry
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        store.dispatch(setRefreshing(true));
        // nếu chưa có refreshPromise => tạo mới
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post("/auth/refresh")
            .then((res) => {
              const token = res.data.data.accessToken;

              store.dispatch(
                setCredentials({
                  accessToken: token,
                  role: store.getState().auth.role, // KHÔNG xử lý role ở đây
                }),
              );

              return token;
            })
            .catch((err) => {
              store.dispatch(clearAuth());
              return null;
            })
            .finally(() => {
              store.dispatch(setRefreshing(false));
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        if (!newToken) {
          return Promise.reject(error);
        }

        // attach token mới và retry request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  );
}
