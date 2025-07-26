import { getPublishedArticles, getCheatCards } from "../../utils/api/http";
import ArticleModel from "../../components/features/articles/models/ArticleModel.ts";
import CheatCardModel from "../../components/features/cheat-cards/models/CheatCardModel.ts";

export type ArticleLoaderOutput = {
  data: ArticleModel[];
  error: string | null;
  loading: boolean;
};

export type CheatCardLoaderOutput = {
  data: CheatCardModel[];
  error: string | null;
  loading: boolean;
};

export type HomeLoaderOutput = {
  articles: ArticleLoaderOutput;
  cheatCards: CheatCardLoaderOutput;
};

export const homeLoader = async (): Promise<HomeLoaderOutput> => {
  const [articlesResult, cheatCardsResult] = await Promise.allSettled([
    (async () => {
      try {
        const data = await getPublishedArticles();
        return { data: data.data, error: null, loading: false };
      } catch (err: unknown) {
        let errorMessage = "Failed to load articles";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        return { data: [], error: errorMessage, loading: false };
      }
    })(),
    (async () => {
      try {
        const data = await getCheatCards();
        return { data: data.data, error: null, loading: false };
      } catch (err: unknown) {
        let errorMessage = "Failed to load cheat cards";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        return { data: [], error: errorMessage, loading: false };
      }
    })(),
  ]);

  return {
    articles: articlesResult.status === "fulfilled" ? articlesResult.value : { data: [], error: "Failed to load articles", loading: false },
    cheatCards: cheatCardsResult.status === "fulfilled" ? cheatCardsResult.value : { data: [], error: "Failed to load cheat cards", loading: false },
  };
};
