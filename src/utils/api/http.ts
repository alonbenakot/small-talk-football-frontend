import axios, { AxiosResponse } from "axios";
import User from "../../features/auth/models/User.ts";
import { SmallTalkResponse } from "../../models/small-talk-response.ts";
import { LoginInput, SignUpInput } from "./api-inputs.ts";


const loginUrl = import.meta.env.VITE_LOGIN_URL;
const signUpUrl = import.meta.env.VITE_SIGNUP_URL;

const checkError = (response: AxiosResponse<SmallTalkResponse<unknown>>) => {
  if (response.data.systemMessage?.isError) {
    throw new Error(response.data.systemMessage?.messageText);
  }
  return true;
}

export const signUp = async (signUpInput: SignUpInput) => {
  const response = await axios.post<SmallTalkResponse<User>>(signUpUrl, signUpInput);

  checkError(response);

  return response.data;
}

export const login = async (input: LoginInput) => {
  const response = await axios.post<SmallTalkResponse<User>>(loginUrl, input);

  checkError(response);

  return response.data;
}