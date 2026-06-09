import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  title: string;
  message?: string;
  isRead: boolean;
  createdAt?: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  lastIncomingId?: string;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },

    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
      // trigger UI event
      state.lastIncomingId = action.payload.id;
    },

    markAsRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.isRead) {
        item.isRead = true;
        state.unreadCount -= 1;
      }
    },

    markAllAsRead(state) {
      state.items.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
