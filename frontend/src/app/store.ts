import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth.slice";
import loadingReducer from "@/features/loading/loading.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

// types dùng về sau
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
