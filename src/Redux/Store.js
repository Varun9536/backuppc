import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { loadState, saveState } from "./persist";

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: persistedState,
});

// Automatically save to localStorage on state change
store.subscribe(() => {
  saveState({
    user: store.getState().user,
  });
});
