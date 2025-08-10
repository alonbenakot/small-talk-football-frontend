import { getCheatCardCategories, getCheatCards } from "../../utils/api/http.ts";
import CheatCardModel from "../../components/features/cheat-cards/models/CheatCardModel.ts";
import { handleLoaderApiCall } from "../../utils/api/api-utils.ts";

export type CheatCardData = {
  data: CheatCardModel[];
  error: string | null;
};

export type CheatCardCategoriesData = {
  data: string[];
  error: string | null;
};

export type CheatCardsPageLoaderOutput = {
  cheatCards: CheatCardData;
  categories: CheatCardCategoriesData;
};

let cache: CheatCardsPageLoaderOutput | null = null;

export const cheatCardsLoader = async (): Promise<CheatCardsPageLoaderOutput> => {
  if (cache) {
    return cache;
  }

  const [cheatCards, categories] = await Promise.all([
    handleLoaderApiCall(getCheatCards, "Failed to load cheat cards", [] as CheatCardModel[]),
    handleLoaderApiCall(getCheatCardCategories, "Failed to load cheat card categories", [] as string[])
  ]);

  const result = {cheatCards, categories};
  cache = result;
  return result;
};
