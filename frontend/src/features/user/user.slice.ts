import type { Role } from "@/types/role";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    id: string;
    email: string;
    fullname: string;
    phone: string;
    role: Role;
    createdAt: string;
  } | null;
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
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
