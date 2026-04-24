import type { Role } from "@/types/role";
import { isValidRole } from "@/utils/role";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  role: null,
  isAuthenticated: false,
  isAuthInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; role: string | null }>,
    ) => {
      const { accessToken, role } = action.payload;

      state.accessToken = accessToken;
      // state.isAuthenticated = true;

      if (role && isValidRole(role)) {
        state.role = role;
        state.isAuthenticated = true;
      } else {
        // fallback an toàn
        state.role = null;
        state.isAuthenticated = false;
      }
      // if (role && isValidRole(role)) {
      //   state.role = role;
      // }
    },

    setAuthInitialized: (state, action: PayloadAction<boolean>) => {
      state.isAuthInitialized = action.payload;
    },

    clearAuth: (state) => {
      state.accessToken = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setAuthInitialized, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
