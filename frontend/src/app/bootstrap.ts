import { refreshClient } from "@shared/api/axios";
import { store } from "./store";
import {
  clearAuth,
  setAuthInitialized,
  setCredentials,
} from "@features/auth/auth.slice";
import { jwtDecode } from "jwt-decode";

export const bootstrapAuth = async () => {
  try {
    const res = await refreshClient.post("/auth/refresh");
    const accessToken = res.data.data.accessToken;

    const payload = jwtDecode<{ role: string }>(accessToken);

    store.dispatch(
      setCredentials({
        accessToken,
        role: payload.role,
      }),
    );
  } catch {
    store.dispatch(clearAuth());
  } finally {
    store.dispatch(setAuthInitialized(true));
  }
};
