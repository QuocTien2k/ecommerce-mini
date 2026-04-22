import { store } from "@/app/store";
import { api, refreshClient } from "./axios";
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
        const res = await refreshClient.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        const meRes = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        const roleFromServer = meRes.data.role;

        //redux
        store.dispatch(
          setCredentials({
            accessToken: newAccessToken,
            role: roleFromServer,
          }),
        );

        processQueue(newAccessToken);

        // retry request gốc
        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err: any) {
        // refresh fail → logout
        if (err.response?.status === 401 || err.response?.status === 403) {
          store.dispatch(clearAuth());
        }
        processQueue(null);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
