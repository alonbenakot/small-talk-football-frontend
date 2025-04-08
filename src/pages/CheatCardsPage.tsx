import { useEffect } from "react";
import useApi from "../utils/hooks/use-api.ts";
import { getCheatCardCategories, getCheatCards } from "../utils/api/http.ts";

const CheatCardsPage = () => {
  const {fetchedData: categories, isLoading, error, invokeApi: invokeCategoriesApi} = useApi(getCheatCardCategories);
  const {fetchedData: cheatCards, invokeApi: invokeCheatCardsApi} = useApi(getCheatCards);
  useEffect(() => {
    const fetchData = async () => {
      await invokeCategoriesApi();
      await invokeCheatCardsApi();
    };
    fetchData();
  }, [invokeCategoriesApi, invokeCheatCardsApi] );

  return (
    <>
      <h2>Cheat Cards</h2>

    </>
  )
}

export default CheatCardsPage;