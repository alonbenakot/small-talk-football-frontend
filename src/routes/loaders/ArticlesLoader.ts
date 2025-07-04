import { LoaderFunctionArgs } from "react-router-dom";
import { getPendingArticles, getPublishedArticles } from "../../utils/api/http";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";

export type ArticleLoaderOutput = {
  data: ArticleModel[];
  error: string | null;
  loading: boolean;
};

export const articlesLoader = async ({request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") ?? "published";

  try {
    const articlesApi = filter === "pending" ? getPendingArticles : getPublishedArticles;
    const data = await articlesApi();
    return {data: data.data, error: null, loading: false};
  } catch (err: unknown) {
    let errorMessage = "Failed to load articles";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return {data: [], error: errorMessage, loading: false};
  }
};