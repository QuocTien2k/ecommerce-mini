import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser } from "../types/adminUser.type";

interface UserState {
  user: AdminUser | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser, updateAvatar } = userSlice.actions;
export default userSlice.reducer;
