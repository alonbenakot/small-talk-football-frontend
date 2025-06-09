import type { LoaderFunction } from "react-router-dom";
import { getPublishedArticles } from "../../utils/api/http.ts";

export const articlesLoader: LoaderFunction = () => {
  return getPublishedArticles();
};