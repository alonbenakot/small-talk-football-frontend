import axios, { AxiosResponse } from "axios";
import User from "../../components/features/auth/models/User.ts";
import { SmallTalkResponse } from "../../models/small-talk-response.ts";
import { LoginInput, SignUpInput } from "./api-inputs.ts";
import CheatCardModel from "../../components/features/cheat-cards/models/CheatCardModel.ts";


const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
const SIGN_UP = import.meta.env.VITE_SIGNUP_URL;
const CATEGORIES_URL = import.meta.env.VITE_CATEGORIES_URL;
const CHEAT_CARDS_URL = import.meta.env.VITE_CHEAT_CARDS_URL;

const checkError = (response: AxiosResponse<SmallTalkResponse<unknown>>) => {
  if (response.data.systemMessage?.isError) {
    throw new Error(response.data.systemMessage?.messageText);
  }
  return true;
}

export const signUp = async (signUpInput: SignUpInput) => {
  const response = await axios.post<SmallTalkResponse<User>>(SIGN_UP, signUpInput);
  checkError(response);
  return response.data;
}

export const login = async (input: LoginInput) => {
  const response = await axios.post<SmallTalkResponse<User>>(LOGIN_URL, input);
  checkError(response);
  return response.data;
}

export const getCheatCardCategories = async () => {
  const response = await axios.get<SmallTalkResponse<string[]>>(CATEGORIES_URL);
  checkError(response);
  return response.data;
}

export const getCheatCards = async () => {
  const response = await axios.get<SmallTalkResponse<CheatCardModel[]>>(CHEAT_CARDS_URL);
  checkError(response);
  return response.data;
}

