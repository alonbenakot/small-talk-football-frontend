import { LoaderFunctionArgs } from "react-router-dom";
import { getArticle } from "../../utils/api/http.ts";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";
import { handleLoaderApiCall } from "../../utils/api/api-utils.ts";

export type OneArticleLoaderOutput = {
  data: ArticleModel;
  error: string | null;
};

export const articleLoader = async ({ request }: LoaderFunctionArgs): Promise<OneArticleLoaderOutput> => {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  const result = await handleLoaderApiCall(
    () => getArticle(id),
    "Failed to load article",
    {} as ArticleModel
  );

  return {
    data: result.data,
    error: result.error
  };
};