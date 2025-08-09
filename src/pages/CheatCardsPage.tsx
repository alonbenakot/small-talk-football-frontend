import { useEffect, useState } from "react";
import CheatCardsByCategories
  from "../components/features/cheat-cards/cheat-card-categories/CheatCardsByCategories.tsx";
import CheatCard from "../components/features/cheat-cards/cheat-card/CheatCard.tsx";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import CheatCardModel from "../components/features/cheat-cards/models/CheatCardModel.ts";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";
import { motion } from "motion/react";
import { CheatCardsPageLoaderOutput } from "../routes/loaders/CheatCardLoader.ts";

type CheatCardParams = { id?: string };
const ERROR_TITLE = "Cheat Cards Error";
const ERROR_MSG = "Hi. We seem to have a problem displaying our cheat cards. If in doubt - blame the referee."

const CheatCardsPage = () => {
    const {id} = useParams<CheatCardParams>();
    const [selectedCheatCard, setSelectedCheatCard] = useState<CheatCardModel | undefined>();
    const navigate = useNavigate();
  const { categories, cheatCards }: CheatCardsPageLoaderOutput = useLoaderData<CheatCardsPageLoaderOutput>();

    // handle cheatCards changes
    useEffect(() => {
      if (cheatCards?.data) {
        setSelectedCheatCard(id
          ? cheatCards.data.find((card: CheatCardModel) => card.id === id)
          : cheatCards.data[0]);
      }
    }, [cheatCards, id]);

    const allApiCallsOk = !cheatCards.error && !categories.error;

    const isFirst = (): boolean => {
      if (cheatCards?.data && selectedCheatCard) {
        const selectedCardIndex = cheatCards.data.indexOf(selectedCheatCard);
        return selectedCardIndex === 0;
      }
      return false;
    }

    const isLast = (): boolean => {
      if (cheatCards?.data && selectedCheatCard) {
        const selectedCardIndex = cheatCards.data.indexOf(selectedCheatCard);
        return selectedCardIndex === cheatCards.data.length - 1;
      }
      return false;
    }

    const onNext = () => {
      if (cheatCards?.data && selectedCheatCard) {
        const selectedCardIndex = cheatCards.data.indexOf(selectedCheatCard);
        const nextCheatCardId = cheatCards.data[selectedCardIndex + 1]?.id;
        navigate(`/cheat-cards/${ nextCheatCardId }`);
      }
    };
    const onPrev = () => {
      if (cheatCards?.data && selectedCheatCard) {
        const selectedCardIndex = cheatCards.data.indexOf(selectedCheatCard);
        const prevCheatCardId = cheatCards.data[selectedCardIndex - 1]?.id;
        navigate(`/cheat-cards/${ prevCheatCardId }`);
      }
    };

    return (
      <motion.div
        className="flex flex-col items-center px-4 py-2"
        initial={ {opacity: 0, y: 20} }
        animate={ {opacity: 1, y: 0} }
        exit={ {opacity: 0, y: -20} }
        transition={ {duration: 0.4} }
      >
        <h1 className="text-3xl text-slate-300 font-bold mb-3 text-center">Cheat Cards</h1>

        { (cheatCards.error || categories.error) && (
          <div className="flex justify-center items-center w-full h-40">
            <ErrorBlock title={ ERROR_TITLE } message={ ERROR_MSG }/>
          </div>
        ) }

        { allApiCallsOk && categories && cheatCards && selectedCheatCard && (
          <motion.div
            className="flex w-full max-w-screen-xl mt-2 gap-6"
            initial={ {opacity: 0, y: 10} }
            animate={ {opacity: 1, y: 0} }
            transition={ {duration: 0.4} }
          >
            <nav aria-label="Categories" className="w-1/4">
              <CheatCardsByCategories
                categories={ categories.data }
                cheatCards={ cheatCards.data }
                selectedCard={ selectedCheatCard }
              />
            </nav>
            <section className="w-3/4">
              <CheatCard
                key={ id }
                { ...selectedCheatCard }
                onNext={ onNext }
                onPrev={ onPrev }
                isFirst={ isFirst() }
                isLast={ isLast() }
              />
            </section>
          </motion.div>
        ) }
      </motion.div>
    );
  }
;

export default CheatCardsPage;