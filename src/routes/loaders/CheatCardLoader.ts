import { getCheatCards } from "../../utils/api/http.ts";

export const cheatCardsLoader = async () => {
  try {
    return await getCheatCards();
  } catch (err: unknown) {
    let errorMessage = "Failed to load cheat cards";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return {data: [], error: errorMessage, loading: false};
  }
};