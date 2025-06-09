import CheatCardModel from "../models/CheatCardModel.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatString, subStringUntilColon } from "../../../../utils/FormatUtil.ts";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  categories: string[],
  cheatCards: CheatCardModel[],
  selectedCard: CheatCardModel,
}

const ARROW_STYLE = "text-slate-300 hover:text-emerald-700 disabled:text-slate-400/50";

const CheatCardsByCategories = ({categories, cheatCards, selectedCard}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);

  useEffect(() => {
    setSelectedCategory(selectedCard.infoCategory);
  }, [selectedCard]);

  const filteredCheatCards = cheatCards
    .filter((card: CheatCardModel) => card.infoCategory === selectedCategory);

  const getSelectedCategoryIndex = () => {
    return categories.findIndex(category => category === selectedCategory);
  }

  const handleNextCategory = () => {
    setSelectedCategory(categories[getSelectedCategoryIndex() + 1]);
  }

  const handlePrevCategory = () => {
    setSelectedCategory(categories[getSelectedCategoryIndex() - 1]);
  }

  return (
    <aside className="relative flex flex-col items-center justify-center rounded-xl border border-gray-200 shadow-sm">
      <h3
        className="relative overflow-hidden whitespace-nowrap mb-1 px-3 py-2 text-md font-bold flex items-center justify-between bg-zinc-800 w-full rounded-t-xl">
        <button
          onClick={ handlePrevCategory } className={ ARROW_STYLE }
          disabled={ getSelectedCategoryIndex() == 0 }
        >
          <ChevronLeft/>
        </button>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={ selectedCategory }
            initial={ {opacity: 0, x: -10} }
            animate={ {opacity: 1, x: 0} }
            exit={ {opacity: 0, x: -10} }
            transition={ {duration: 1, type: "spring", stiffness: 500, damping: 30} }
            className="absolute left-1/2 transform -translate-x-1/2 text-emerald-600"
          >
            { formatString(selectedCategory) }
          </motion.span>
        </AnimatePresence>
        <button
          onClick={ handleNextCategory } className={ ARROW_STYLE }
          disabled={ getSelectedCategoryIndex() === categories.length - 1 }
        >
          <ChevronRight/>
        </button>
      </h3>
      <AnimatePresence mode="popLayout">
        <motion.ul
          key={ selectedCategory }
          initial={ {opacity: 0, x: -10} }
          animate={ {opacity: 1, x: 0} }
          exit={ {opacity: 0, x: -10} }
          transition={ {duration: 1, type: "spring", stiffness: 500, damping: 30} }
          className="text-center p-2 w-full"
        >
          { filteredCheatCards.map((card: CheatCardModel) => (
            <li key={ card.id } className="mb-2">
              <Link to={ `/cheat-cards/${ card.id }` }>
                <span
                  className={ card.id === selectedCard.id ? "font-medium border-b-2 border-emerald-600" : undefined }>{ subStringUntilColon(card.title) }</span>
              </Link>
            </li>
          )) }
        </motion.ul>
      </AnimatePresence>
    </aside>
  )
}

export default CheatCardsByCategories;