import { LoaderFunctionArgs } from "react-router-dom";
import { getPendingArticles, getPublishedArticles } from "../../utils/api/http";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";
import { handleLoaderApiCall } from "../../utils/api/api-utils.ts";

export type ArticleLoaderOutput = {
  data: ArticleModel[];
  error: string | null;
};

export const articlesLoader = async ({request}: LoaderFunctionArgs): Promise<ArticleLoaderOutput> => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") ?? "published";

  const articlesApi = filter === "pending" ? getPendingArticles : getPublishedArticles;
  const errorMessage = filter === "pending" ? "Failed to load pending articles" : "Failed to load published articles";

  const result = await handleLoaderApiCall(articlesApi, errorMessage, [] as ArticleModel[]);

  return {
    data: result.data,
    error: result.error
  };
};