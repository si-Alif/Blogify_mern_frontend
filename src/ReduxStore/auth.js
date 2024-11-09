import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: true,
  userInfo: null, 
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload.userInfo; 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null; 
    },
  },
});

export const { login, logout } = auth.actions;

export default auth.reducer;
