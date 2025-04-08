import { configureStore } from "@reduxjs/toolkit";
import userSlice, { login, logout } from "./user-slice.ts";
import langSlice, { toggleLang } from "./lang-slice.ts";
import { useDispatch, useSelector } from "react-redux";
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

  const dispatchToggleLang = (lang: Lang) => {
    dispatch(toggleLang(lang));
  }

  return {selectedLang, dispatchToggleLang};
}

export const useAuthStore = () => {
  const selectedUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const dispatchLogin = (user: User) => {
    dispatch(login(user));
  }
  const dispatchLogout = () => {
    dispatch(logout());
  }

  return {selectedUser, dispatchLogin, dispatchLogout};
}

