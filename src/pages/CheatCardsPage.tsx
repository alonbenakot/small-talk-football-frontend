import { useEffect } from "react";
import useApi from "../utils/hooks/use-api.ts";
import { getCheatCardCategories, getCheatCards } from "../utils/api/http.ts";
import CheatCardsByCategories
  from "../components/features/cheat-cards/cheat-card-categories/CheatCardsByCategories.tsx";
import CheatCard from "../components/features/cheat-cards/cheat-card/CheatCard.tsx";

const CheatCardsPage = () => {
  const {
    fetchedData: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    invokeApi: invokeCategoriesApi
  } = useApi(getCheatCardCategories);
  const {
    fetchedData: cheatCards,
    isLoading: isCheatCardsLoading,
    error: cheatCardsError,
    invokeApi: invokeCheatCardsApi
  } = useApi(getCheatCards);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([invokeCategoriesApi(), invokeCheatCardsApi()]);
    };
    fetchData();
  }, [invokeCategoriesApi, invokeCheatCardsApi]);

  const allApiCallsOk = !isCheatCardsLoading && !isCategoriesLoading
    && !cheatCardsError && !categoriesError;

  return (
    <>
      <h2>Cheat Cards</h2>
      <div>
        { allApiCallsOk && categories && cheatCards &&
          <CheatCardsByCategories
            categories={ categories.data }
            cheatCards={ cheatCards.data }
            selectedCardCategory={ categories.data[0] }
          /> }
      </div>
      <div>
        { !isCheatCardsLoading && !cheatCardsError && cheatCards &&
        <CheatCard {...cheatCards.data[0]}/> }
      </div>
    </>
  )
}

export default CheatCardsPage;