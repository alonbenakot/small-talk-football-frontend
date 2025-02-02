import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Lang from "../features/language/Lang.ts";

type LangState = { lang: Lang }

const initialState: LangState = {lang: 'british'};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    toggleLang: (state: LangState, action: PayloadAction<LangState>) => {
      state.lang = action.payload.lang;
    }
  }
});

export default langSlice.reducer;
export const {toggleLang} = langSlice.actions;