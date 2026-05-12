import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadCount: 0,
};

export const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadCount, decrementUnreadCount, resetUnreadCount } = NotificationSlice.actions;
export default NotificationSlice.reducer;
