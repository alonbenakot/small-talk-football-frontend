import { configureStore } from "@reduxjs/toolkit";
import userSlice, { login, logout, triggerPendingArticleIndication } from "./user-slice.ts";
import langSlice, { toggleLang } from "./lang-slice.ts";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react"; // Add this import
import Lang from "../components/features/language/Lang.ts";
import User from "../components/features/auth/models/User.ts";

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

  const dispatchToggleLang = useCallback((lang: Lang) => {
    dispatch(toggleLang(lang));
  }, [dispatch]);

  return {selectedLang, dispatchToggleLang};
}

export const useAuthStore = () => {
  const selectedUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const dispatchLogin = useCallback((user: User) => {
    dispatch(login(user));
  }, [dispatch]);

  const dispatchLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const dispatchTriggerArticleInd = useCallback((isPendingArticles: boolean) => {
    dispatch(triggerPendingArticleIndication(isPendingArticles));
  }, [dispatch]);

  return {selectedUser, dispatchLogin, dispatchLogout, dispatchTriggerArticleInd};
}