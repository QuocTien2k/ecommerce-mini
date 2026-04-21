import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  role: string | null;
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
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
      state.isAuthenticated = true;
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
