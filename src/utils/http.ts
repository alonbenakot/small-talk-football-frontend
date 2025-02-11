import axios from "axios";
import User from "../features/auth/models/User.ts";


export async function login() {
  const response = await axios.get<User>(import.meta.env.VITE_LOGIN_URL);
  return response.data;
}