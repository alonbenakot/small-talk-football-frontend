import axios from "axios";
import User from "../../components/features/auth/models/User.ts";
import { SmallTalkResponse } from "../../models/small-talk-response.ts";
import { LoginInput, SignUpInput } from "./api-inputs.ts";
import CheatCardModel from "../../components/features/cheat-cards/models/CheatCardModel.ts";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";
import jwtAxios from "./jwtAxios.ts";


const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
const SIGN_UP_URL = import.meta.env.VITE_SIGNUP_URL;
const CATEGORIES_URL = import.meta.env.VITE_CATEGORIES_URL;
const CHEAT_CARDS_URL = import.meta.env.VITE_CHEAT_CARDS_URL;
const PUBLISHED_ARTICLES_URL = import.meta.env.VITE_ARTICLES_PUBLISHED_URL;
const PENDING_ARTICLES_URL = import.meta.env.VITE_ARTICLES_PENDING_URL;
const PUBLISH_ARTICLE_URL = import.meta.env.VITE_PUBLISH_ARTICLE_URL;
const REMOVE_ARTICLE_URL = import.meta.env.VITE_REMOVE_ARTICLE_URL;
const GET_ARTICLE_URL = import.meta.env.VITE_GET_ARTICLE_URL;

export const UNAUTHORIZED_MSG = 'You are unauthorized to make this action. If you think you should be, please log in again.';

export const signUp = async (signUpInput: SignUpInput) => {
  const response = await axios.post<SmallTalkResponse<User>>(SIGN_UP_URL, signUpInput);
  return response.data;
}

export const login = async (input: LoginInput) => {
  const response = await axios.post<SmallTalkResponse<User>>(LOGIN_URL, input);
  return response.data;
}

export const getCheatCardCategories = async () => {
  const response = await axios.get<SmallTalkResponse<string[]>>(CATEGORIES_URL);
  return response.data;
}

export const getCheatCards = async () => {
  const response = await axios.get<SmallTalkResponse<CheatCardModel[]>>(CHEAT_CARDS_URL);
  return response.data;
}

export const getPublishedArticles = async () => {
  const response = await axios.get<SmallTalkResponse<ArticleModel[]>>(PUBLISHED_ARTICLES_URL);
  return response.data;
}

export const getPendingArticles = async () => {
  const response = await axios.get<SmallTalkResponse<ArticleModel[]>>(PENDING_ARTICLES_URL);
  return response.data;
}

export const publishArticle = async (articleId: string) => {
  const response = await jwtAxios.patch<SmallTalkResponse<ArticleModel>>(
    `${PUBLISH_ARTICLE_URL}/${articleId}`);
  return response.data;
}

export const removeArticle = async (articleId: string) => {
  const response = await jwtAxios.patch<SmallTalkResponse<ArticleModel>>(
    `${REMOVE_ARTICLE_URL}/${articleId}`);
  return response.data;
}

export const getArticle = async (articleId: string) => {
  const response = await axios.get<SmallTalkResponse<ArticleModel>>(
    `${GET_ARTICLE_URL}/${articleId}`);
  return response.data;
}

