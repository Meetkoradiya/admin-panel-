/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isResettingPassword: false,
  token: "",
  refreshToken: "",
  expires_at: "",
  time: 0,
  userData: {},
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, userData } = action.payload;
      state.isAuthenticated = !!token;
      state.token = token;
      state.refreshToken = action.payload.refreshToken;
      state.expires_at = action.payload.expires_at;
      state.time = action.payload.time;
      state.userData = userData;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoggingOut = false;
      state.token = "";
      state.userData = {};
    },
    updateToken: (state, action) => {
      state.token = action.payload.token;
      state.expires_at = action.payload.expires_at;
      state.time = action.payload.time;
    },
  },
});

export const { login, updateToken, logout } = AuthSlice.actions;
export default AuthSlice.reducer;

export const selectUserData = (state) => state.auth.userData;
