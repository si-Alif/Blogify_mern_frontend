import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  session: null, // Stores the session data (e.g., session ID, expiration time)
  userInfo: null, // Stores user information (e.g., user ID, name, email)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {  // Renamed to match auth.js
      state.isAuthenticated = true;
      state.session = action.payload.session; // Save session details
      state.userInfo = action.payload.userInfo; // Save user details
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.session = null;
      state.userInfo = null;
    },
  },
});

export const {login, logout } = authSlice.actions;  // Export renamed action
export default authSlice.reducer;
