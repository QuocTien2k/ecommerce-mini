import { refreshClient } from "@shared/api/axios";
import { store } from "./store";
import {
  clearAuth,
  setAuthInitialized,
  setCredentials,
} from "@features/auth/auth.slice";
import { jwtDecode } from "jwt-decode";
// import { userApi } from "@features/user/api/user.api";
// import { setUser } from "@features/user/store/user.slice";

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
  //const currentAccessToken = store.getState().auth.accessToken;
  const state = store.getState().auth;

  const { accessToken, hasAuthHint } = state;

  //accessToken còn hạn → skip
  if (accessToken && !isTokenExpired(accessToken)) {
    const payload = jwtDecode<{ role: string }>(accessToken);

    store.dispatch(
      setCredentials({
        accessToken,
        role: payload.role,
      }),
    );

    store.dispatch(setAuthInitialized(true));
    return;
  }

  //không có hint => chưa login => skip
  if (!hasAuthHint) {
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

    //gọi lại để set User
    // const profile = await userApi.getMe();
    // store.dispatch(setUser(profile));
  } catch {
    store.dispatch(clearAuth());
  } finally {
    store.dispatch(setAuthInitialized(true));
  }
};
