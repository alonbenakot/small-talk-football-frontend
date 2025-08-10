import { useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import CheatCardModel from "../components/features/cheat-cards/models/CheatCardModel.ts";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";
import { CheatCardsPageLoaderOutput } from "../routes/loaders/CheatCardLoader.ts";
import { formatString } from "../utils/FormatUtil.ts";
import CheatCardDisplay from "../components/features/cheat-cards/cheat-card-display/CheatCardDisplay.tsx";
import CheatCardPreviewGrid from "../components/features/cheat-cards/cheat-card-preview-grid/CheatCardPreviewGrid.tsx";

type CheatCardParams = { id?: string };
const ERROR_TITLE = "Cheat Cards Error";
const ERROR_MSG = "Hi. We seem to have a problem displaying our cheat cards. If in doubt - blame the referee.";

const CheatCardsPage = () => {
  const {id} = useParams<CheatCardParams>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const navigate = useNavigate();
  const {categories, cheatCards}: CheatCardsPageLoaderOutput = useLoaderData<CheatCardsPageLoaderOutput>();

  // initialize selected category
  useEffect(() => {
    if (categories?.data?.length > 0 && !selectedCategory) {
      setSelectedCategory(categories.data[0]);
    }
  }, [categories, selectedCategory]);

  // handle URL parameter changes
  useEffect(() => {
    if (cheatCards?.data && id) {
      const targetCard = cheatCards.data.find((card: CheatCardModel) => card.id === id);
      if (targetCard) {
        setSelectedCategory(targetCard.infoCategory);
        const filteredCards = cheatCards.data.filter((card: CheatCardModel) =>
          card.infoCategory === targetCard.infoCategory
        );
        const cardIndex = filteredCards.findIndex((card: CheatCardModel) => card.id === id);
        setSelectedCardIndex(cardIndex >= 0 ? cardIndex : 0);
      }
    } else if (cheatCards?.data && !id) {
      const firstCategory = categories?.data?.[0];
      setSelectedCategory(firstCategory);
      setSelectedCardIndex(0);
    }
  }, [cheatCards, id, categories]);

  const isError = !!cheatCards?.error || !!categories?.error;
  const filteredCards = cheatCards?.data
    ? cheatCards.data.filter((card: CheatCardModel) => card.infoCategory === selectedCategory)
    : [];
  const currentCard = filteredCards[selectedCardIndex];

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedCardIndex(0);

    const newCategoryCards = cheatCards?.data?.filter((card: CheatCardModel) =>
      card.infoCategory === category
    );
    if (newCategoryCards && newCategoryCards.length > 0) {
      navigate(`/cheat-cards/${ newCategoryCards[0].id }`);
    }
  }, [cheatCards?.data, navigate]);

  const handleCardSelect = useCallback((index: number) => {
    setSelectedCardIndex(index);
    if (filteredCards[index]) {
      navigate(`/cheat-cards/${ filteredCards[index].id }`);
    }
  }, [filteredCards, navigate]);

  const handleNext = useCallback(() => {
    if (selectedCardIndex < filteredCards.length - 1) {
      const nextIndex = selectedCardIndex + 1;
      setSelectedCardIndex(nextIndex);
      navigate(`/cheat-cards/${ filteredCards[nextIndex].id }`);
    }
  }, [selectedCardIndex, filteredCards, navigate]);

  const handlePrev = useCallback(() => {
    if (selectedCardIndex > 0) {
      const prevIndex = selectedCardIndex - 1;
      setSelectedCardIndex(prevIndex);
      navigate(`/cheat-cards/${ filteredCards[prevIndex].id }`);
    }
  }, [selectedCardIndex, filteredCards, navigate]);

  if (isError) {
    return (
      <motion.div
        className="flex flex-col items-center px-4 py-8"
        initial={ {opacity: 0, y: 20} }
        animate={ {opacity: 1, y: 0} }
        transition={ {duration: 0.4} }
      >
        <div className="flex justify-center items-center w-full h-40">
          <ErrorBlock title={ ERROR_TITLE } message={ ERROR_MSG }/>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      initial={ {opacity: 0} }
      animate={ {opacity: 1} }
      transition={ {duration: 0.5} }
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={ {y: -20, opacity: 0} }
          animate={ {y: 0, opacity: 1} }
          transition={ {duration: 0.6} }
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">
            Football Cheat Cards
          </h1>
          <p className="text-slate-400 text-lg">
            Quick reference for football conversations
          </p>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={ {y: 20, opacity: 0} }
          animate={ {y: 0, opacity: 1} }
          transition={ {duration: 0.6, delay: 0.2} }
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
            { categories?.data?.map((category: string, index: number) => (
              <motion.button
                key={ category }
                onClick={ () => handleCategoryChange(category) }
                className={ `px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 shadow-md hover:shadow-lg'
                }` }
                whileHover={ {scale: 1.05} }
                whileTap={ {scale: 0.95} }
                initial={ {opacity: 0, y: 10} }
                animate={ {opacity: 1, y: 0} }
                transition={ {duration: 0.4, delay: 0.1 * index} }
              >
                { formatString(category) }
              </motion.button>
            )) }
          </div>

          <div className="text-center text-slate-400 text-sm">
            { filteredCards.length } cards in { formatString(selectedCategory) }
          </div>
        </motion.div>

        { currentCard && (
          <CheatCardDisplay
            currentCard={ currentCard }
            selectedCategory={ selectedCategory }
            selectedCardIndex={ selectedCardIndex }
            filteredCards={ filteredCards }
            onNext={ handleNext }
            onPrev={ handlePrev }
            onCardSelect={ handleCardSelect }
          />
        ) }

        <CheatCardPreviewGrid
          filteredCards={ filteredCards }
          selectedCardIndex={ selectedCardIndex }
          onCardSelect={ handleCardSelect }
        />
      </div>
    </motion.div>
  );
};

export default CheatCardsPage;