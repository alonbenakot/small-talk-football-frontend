import CheatCardModel from "../models/CheatCardModel.ts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatString, subStringUntilColon } from "../../../../utils/FormatUtil.ts";

type Props = {
  categories: string[],
  cheatCards: CheatCardModel[],
  selectedCardCategory: string,
}

const CheatCardsByCategories = ({categories, cheatCards, selectedCardCategory}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCardCategory);
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
    <aside className="flex flex-col items-center justify-center">
      <h3 className="mb-3 flex items-center gap-2">
        { getSelectedCategoryIndex() > 0 &&
          <button onClick={ handlePrevCategory } className="text-emerald-700">
            <ChevronLeft/>
          </button>
        }
        <span className="capitalize">{ formatString(selectedCategory) }</span>
        { categories.length - 1 > getSelectedCategoryIndex() &&
          <button onClick={ handleNextCategory } className="text-emerald-700">
            <ChevronRight/>
          </button>
        }
      </h3>
      <ul className="text-center">
        { filteredCheatCards.map((card: CheatCardModel) =>
          <li key={ card.id } className="m-2">
            <Link to={ `/cheat-cards/${ card.id }` }>
              { subStringUntilColon(card.title) }
            </Link></li>
        ) }
      </ul>
    </aside>
  )
}

export default CheatCardsByCategories;