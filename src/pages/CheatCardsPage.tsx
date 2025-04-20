import { useEffect, useState } from "react";
import useApi from "../utils/hooks/use-api.ts";
import { getCheatCardCategories, getCheatCards } from "../utils/api/http.ts";
import CheatCardsByCategories
  from "../components/features/cheat-cards/cheat-card-categories/CheatCardsByCategories.tsx";
import CheatCard from "../components/features/cheat-cards/cheat-card/CheatCard.tsx";
import { useParams } from "react-router-dom";
import CheatCardModel from "../components/features/cheat-cards/models/CheatCardModel.ts";
import Loader from "../components/ui/loader/Loader.tsx";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";

type CheatCardParams = { id?: string };
const ERROR_TITLE = "Cheat Cards Error";
const ERROR_MSG = "Hi. We seem to have a problem displaying our cheat cards. If in doubt - blame the referee."

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

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([invokeCategoriesApi(), invokeCheatCardsApi()]);
    };
    fetchData();
  }, [invokeCategoriesApi, invokeCheatCardsApi]);

  // handle cheatCards changes
  useEffect(() => {
    if (cheatCards?.data) {
      setSelectedCheatCard(id
        ? cheatCards.data.find((card: CheatCardModel) => card.id === id)
        : cheatCards.data[0]);
    }
  }, [cheatCards, id]);

  // handle categories changes
  useEffect(() => {
    setSelectedCategory(selectedCheatCard
      ? selectedCheatCard.infoCategory
      : categories?.data[0]);
  }, [selectedCheatCard, categories?.data]);

  const allApiCallsOk = !isCheatCardsLoading && !isCategoriesLoading
    && !cheatCardsError && !categoriesError;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Cheat Cards</h1>

      { (isCheatCardsLoading || isCategoriesLoading) && (
        <div className="flex justify-center items-center w-full h-40">
          <Loader/>
        </div>
      ) }

      { (cheatCardsError || categoriesError) && (
        <div className="flex justify-center items-center w-full h-40">
          <ErrorBlock title={ ERROR_TITLE } message={ ERROR_MSG }/>
        </div>
      ) }

      { allApiCallsOk && categories && cheatCards && selectedCheatCard && (
        <div className="flex w-full max-w-screen-xl mt-6 gap-6">
          <nav aria-label="Categories" className="w-1/4">
            <CheatCardsByCategories
              categories={ categories.data }
              cheatCards={ cheatCards.data }
              selectedCardCategory={ selectedCategory ?? "" }
            />
          </nav>
          <section className="w-3/4">
            <CheatCard { ...selectedCheatCard } />
          </section>
        </div>
      ) }
    </div>
  );
};

export default CheatCardsPage;