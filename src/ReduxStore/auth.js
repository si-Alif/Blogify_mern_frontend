import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  // session: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      // state.session = action.payload.session;
      state.userInfo = action.payload.userInfo;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      // state.session = null;
      state.userInfo = null;
    },
  },
});

export const {login, logout } = authSlice.actions;
export default authSlice.reducer;
