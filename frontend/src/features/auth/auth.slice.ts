import type { Role } from "@/types/role";
import { isValidRole } from "@/utils/role";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; role: string }>,
    ) => {
      const { accessToken, role } = action.payload;

      state.accessToken = accessToken;

      if (isValidRole(role)) {
        state.role = role;
        state.isAuthenticated = true;
      } else {
        // fallback an toàn
        state.role = null;
        state.isAuthenticated = false;
      }
    },

    clearAuth: (state) => {
      state.accessToken = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;

export default authSlice.reducer;
