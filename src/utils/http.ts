import axios, { AxiosResponse } from "axios";
import User, { LoginInput } from "../features/auth/models/User.ts";
import { SmallTalkResponse } from "../models/small-talk-response.ts";


const loginUrl = import.meta.env.VITE_LOGIN_URL;

const checkError = (response: AxiosResponse<SmallTalkResponse<unknown>>) => {
  if (response.data.systemMessage?.isError) {
    throw new Error(response.data.systemMessage?.messageText);
  }
  return true;
}

export async function login(input: LoginInput) {
  const params = {params: {email: input.email, password: input.password}};
  const response = await axios.get<SmallTalkResponse<User>>(loginUrl, params);

  checkError(response);

  return response.data;
}