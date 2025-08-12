import { configureStore } from "@reduxjs/toolkit";
import userSlicer from "../function/user.redux";

export const store = configureStore({
  reducer: { userSlicer: userSlicer.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
