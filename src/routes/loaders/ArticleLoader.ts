import { LoaderFunctionArgs } from "react-router-dom";
import { getArticle } from "../../utils/api/http.ts";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";
import { extractIdFromUrl, handleLoaderApiCall } from "../../utils/api/api-utils.ts";

export type OneArticleLoaderOutput = {
  data: ArticleModel;
  error: string | null;
};


export const articleLoader = async ({ request }: LoaderFunctionArgs): Promise<OneArticleLoaderOutput> => {
  const result = await handleLoaderApiCall(
    () => getArticle(extractIdFromUrl(request)),
    "Failed to load article",
    {} as ArticleModel
  );

    if (result.error) {
      throw new Response(result.error, {status: result.statusCode});
    }

  return {
    data: result.data,
    error: result.error
  };
};