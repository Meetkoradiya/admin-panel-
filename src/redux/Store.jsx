import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { AuthSlice } from "./slice/AuthSlice";
import NotificationReducer from "./slice/NotificationSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "notification"],
};

const rootReducer = combineReducers({
  auth: AuthSlice.reducer,
  notification: NotificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
