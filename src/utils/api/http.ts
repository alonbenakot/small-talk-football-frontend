import axios from "axios";
import User from "../../components/features/auth/models/User.ts";
import { SmallTalkResponse } from "../../models/small-talk-response.ts";
import { AddArticleInput, LoginInput, SignUpInput } from "./api-inputs.ts";
import CheatCardModel from "../../components/features/cheat-cards/models/CheatCardModel.ts";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";
import jwtAxios from "./jwtAxios.ts";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LOGIN_URL = `${BASE_URL}users/login`;
const SIGN_UP_URL = `${BASE_URL}users/signup`;
const CATEGORIES_URL = `${BASE_URL}small-infos/categories`;
const CHEAT_CARDS_URL = `${BASE_URL}small-infos`;
const PUBLISHED_ARTICLES_URL = `${BASE_URL}articles/published`;
const PENDING_ARTICLES_URL = `${BASE_URL}articles/pending`;
const PUBLISH_ARTICLE_URL = `${BASE_URL}articles/publish`;
const REMOVE_ARTICLE_URL = `${BASE_URL}articles/remove`;
const BASE_ARTICLES_URL = `${BASE_URL}articles`;
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
    `${BASE_ARTICLES_URL}/${articleId}`);
  return response.data;
}

export const addArticle = async (addArticleInput: AddArticleInput) => {
  const response = await jwtAxios.post<SmallTalkResponse<User>>(BASE_ARTICLES_URL, addArticleInput);
  return response.data;
}

export const deleteArticle = async (articleId: string) => {
  const response = await jwtAxios.delete(`${BASE_ARTICLES_URL}/${articleId}`);
  return response.data;
}


