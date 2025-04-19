import CheatCardModel from "../models/CheatCardModel.ts";
import { useState } from "react";
import { Link } from "react-router-dom";

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
    <aside>
      <h3>
        <button onClick={ handlePrevCategory }>&lt;</button>
        { selectedCategory }
        <button onClick={ handleNextCategory }>&gt;</button>
      </h3>
      <ul>
        { filteredCheatCards.map((card: CheatCardModel) =>
          <li key={ card.id }><Link to={`/cheat-cards/${card.id}`}>{ card.title }</Link></li>
        ) }
      </ul>
    </aside>
  )
}

export default CheatCardsByCategories;