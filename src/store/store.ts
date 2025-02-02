import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-slice.ts";
import langSlice from "./lang-slice.ts";

const store = configureStore({
  reducer: {
    auth: userSlice,
    lang: langSlice
  }
});
export type RootState = ReturnType<typeof store.getState>;

export default store;

