import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../features/auth/models/User.ts";

type UserState = {
  user: User | null;
}

const initialState: UserState = {
  user: null
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state: UserState) => {
      state.user = null;
    }
  }
});

export const { login, logout} = userSlice.actions;
export default userSlice.reducer;