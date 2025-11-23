import { getCheatCards, getPublishedArticles } from "../../utils/api/http";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";
import CheatCardModel from "../../components/features/cheat-cards/models/CheatCardModel.ts";
import { handleLoaderApiCall } from "../../utils/api/api-utils.ts";

export type ArticleData = {
  data: ArticleModel[];
  error: string | null;
};

export type CheatCardData = {
  data: CheatCardModel[];
  error: string | null;
};

export type HomeLoaderOutput = {
  articles: ArticleData;
  cheatCards: CheatCardData;
};

export const homeLoader = async (): Promise<HomeLoaderOutput> => {
  const [articles, cheatCards] = await Promise.all([
    handleLoaderApiCall(getPublishedArticles, "Failed to load articles", [] as ArticleModel[]),
    handleLoaderApiCall(getCheatCards, "Failed to load cheat cards", [] as CheatCardModel[])
  ]);

  if (articles.error) {
    throw new Response(articles.error, {status: articles.statusCode});
  }
  if (cheatCards.error) {
    throw new Response(cheatCards.error, {status: cheatCards.statusCode});
  }

  return {
    articles, cheatCards,
  };

};