import { useEffect, useState } from "react";
import useApi from "../utils/hooks/use-api.ts";
import { getCheatCardCategories, getCheatCards } from "../utils/api/http.ts";
import CheatCardsByCategories
  from "../components/features/cheat-cards/cheat-card-categories/CheatCardsByCategories.tsx";
import CheatCard from "../components/features/cheat-cards/cheat-card/CheatCard.tsx";
import { useParams } from "react-router-dom";
import CheatCardModel from "../components/features/cheat-cards/models/CheatCardModel.ts";
import Loader from "../components/ui/loader/Loader.tsx";

type CheatCardParams = { id?: string };

const CheatCardsPage = () => {
  const {id} = useParams<CheatCardParams>();
  const [selectedCheatCard, setSelectedCheatCard] = useState<CheatCardModel | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
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

  useEffect(() => {
    if (cheatCards?.data) {
      setSelectedCheatCard(id
        ? cheatCards.data.find((card: CheatCardModel) => card.id === id)
        : cheatCards.data[0]);
    }
  }, [cheatCards, id,]);

  useEffect(() => {
    setSelectedCategory(selectedCheatCard
      ? selectedCheatCard.infoCategory
      : categories?.data[0]);
  }, [selectedCheatCard, categories?.data]);

  const allApiCallsOk = !isCheatCardsLoading && !isCategoriesLoading
    && !cheatCardsError && !categoriesError;

  return (
    <>
      <h2>Cheat Cards</h2>
      {(isCheatCardsLoading || isCategoriesLoading) && <Loader/>}
      <div>
        { allApiCallsOk && categories && cheatCards &&
          <CheatCardsByCategories
            categories={ categories.data }
            cheatCards={ cheatCards.data }
            selectedCardCategory={ selectedCategory ?? ''}
          /> }
      </div>
      <div>
        { !isCheatCardsLoading && !cheatCardsError && cheatCards && selectedCheatCard &&
          <CheatCard { ...selectedCheatCard }/> }
      </div>
    </>
  )
}

export default CheatCardsPage;