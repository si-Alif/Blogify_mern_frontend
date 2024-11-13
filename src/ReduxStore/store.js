import { configureStore, combineReducers } from "@reduxjs/toolkit";
import theme from "./theme";
import auth from "./auth.js" // Updated import path
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Specify which reducers you want to persist
};

const rootReducer = combineReducers({
  theme: theme,
  auth: auth,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore redux-persist actions
      },
    }),
});

const persistor = persistStore(reduxStore);

export { reduxStore, persistor };
