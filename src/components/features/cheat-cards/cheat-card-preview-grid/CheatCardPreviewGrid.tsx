import { motion } from "motion/react";
import CheatCardModel from "../models/CheatCardModel.ts";
import CheatCardPreview from "../cheat-card-preview/CheatCardPreview.tsx";

interface CheatCardPreviewGridProps {
  filteredCards: CheatCardModel[];
  selectedCardIndex: number;
  onCardSelect: (index: number) => void;
}

const CheatCardPreviewGrid = ({filteredCards, selectedCardIndex, onCardSelect}:
                              CheatCardPreviewGridProps) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={ {opacity: 0, y: 20} }
      animate={ {opacity: 1, y: 0} }
      transition={ {duration: 0.6, delay: 0.5} }
    >
      { filteredCards.map((card: CheatCardModel, index: number) => (
        <CheatCardPreview
          key={ card.id }
          card={ card }
          index={ index }
          isSelected={ index === selectedCardIndex }
          onSelect={ onCardSelect }
        />
      )) }
    </motion.div>
  );
};


export default CheatCardPreviewGrid;