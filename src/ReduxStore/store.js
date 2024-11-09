import { configureStore } from "@reduxjs/toolkit";
import theme from "./theme.js"
import auth from "./auth.js"

const reduxStore = configureStore({
  reducer: {
      theme:theme,
      auth:auth
  }
});

export default reduxStore;