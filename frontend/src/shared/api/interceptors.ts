import { api } from "./axios";
import { store } from "@/store";
import { clearAuth, setCredentials } from "@/features/auth/auth.slice";

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

export function setupInterceptors() {
  // REQUEST INTERCEPTOR
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // nếu đang refresh thì queue request lại
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string | null) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        // update redux
        store.dispatch(setCredentials({ accessToken: newAccessToken }));

        processQueue(newAccessToken);

        // retry request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(clearAuth());
        processQueue(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
