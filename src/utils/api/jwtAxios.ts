import axios from "axios";
import User from "../../components/features/auth/models/User.ts";

const jwtAxios = axios.create();

jwtAxios.interceptors.request.use(
  (config) => {
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.jwt) {
      config.headers.Authorization = `Bearer ${user.jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default jwtAxios;
