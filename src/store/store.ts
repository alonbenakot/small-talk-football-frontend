import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-slice.ts";
import langSlice, { toggleLang } from "./lang-slice.ts";
import { useDispatch, useSelector } from "react-redux";
import Lang from "../features/language/Lang.ts";

const store = configureStore({
  reducer: {
    auth: userSlice,
    lang: langSlice
  }
});
export type RootState = ReturnType<typeof store.getState>;

export default store;

export const useLangStore = () => {
  const selectedLang = useSelector((state: RootState) => state.lang.lang);
  const dispatch = useDispatch();

  const dispatchToggleLang = (lang: Lang) => {
    dispatch(toggleLang(lang));
  }

  return {selectedLang, dispatchToggleLang};
}

