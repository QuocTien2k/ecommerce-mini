import { refreshClient } from "@shared/api/axios";
import { store } from "./store";
import {
  clearAuth,
  setAuthInitialized,
  setCredentials,
} from "@features/auth/auth.slice";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const bootstrapAuth = async () => {
  //const hasRefreshToken = document.cookie.includes("refreshToken");
  const currentAccessToken = store.getState().auth.accessToken;

  //accessToken còn hạn → skip
  if (currentAccessToken && !isTokenExpired(currentAccessToken)) {
    store.dispatch(setAuthInitialized(true));
    return;
  }

  try {
    const res = await refreshClient.post("/auth/refresh");
    const newAccessToken = res.data.data.accessToken;

    const payload = jwtDecode<{ role: string }>(newAccessToken);

    store.dispatch(
      setCredentials({
        accessToken: newAccessToken,
        role: payload.role,
      }),
    );
  } catch {
    store.dispatch(clearAuth());
  } finally {
    store.dispatch(setAuthInitialized(true));
  }
};
