import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth.slice";
import userReducer from "@features/admin/user/store/user.slice";
import notificationReducer from "@/features/notification/store/notification.slice";
import orderReducer from "@/features/customer/order/store/order.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
    order: orderReducer,
  },
});

// types dùng về sau
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
