import { LoaderFunctionArgs } from "react-router-dom";
import { getArticle } from "../../utils/api/http.ts";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";

export type OneArticleLoaderOutput = {
  data: ArticleModel;
  error: string | null;
  loading: boolean;
};

export const articleLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  try {
    const data = await getArticle(id);
    return { data: data.data, error: null, loading: false };
  } catch (err: unknown) {
    let errorMessage = "Failed to load article";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return { data: [], error: errorMessage, loading: false };
  }
};
