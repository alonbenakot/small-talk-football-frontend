import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../components/features/auth/models/User.ts";

type UserState = {
  user: User | null;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state: UserState) => {
      state.user = null;
      localStorage.removeItem("user");
    }
  }
});

export const { login, logout} = userSlice.actions;
export default userSlice.reducer;