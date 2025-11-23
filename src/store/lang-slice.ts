import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Lang} from "../components/features/language/Lang.ts";

type LangState = { lang: Lang }

const initialState: LangState = {lang: Lang.BRITISH};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    toggleLang: (state: LangState, action: PayloadAction<Lang>) => {
      state.lang = action.payload;
    }
  }
});

export default langSlice.reducer;
export const {toggleLang} = langSlice.actions;