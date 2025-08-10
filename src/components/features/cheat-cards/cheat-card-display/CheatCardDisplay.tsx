import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CheatCardModel, { InfoText } from "../models/CheatCardModel.ts";
import Button from "../../../ui/button/Button.tsx";
import { useLangStore } from "../../../../store/store.ts";

interface CheatCardDisplayProps {
  currentCard: CheatCardModel;
  selectedCategory: string;
  selectedCardIndex: number;
  filteredCards: CheatCardModel[];
  onNext: () => void;
  onPrev: () => void;
  onCardSelect: (index: number) => void;
}

const CheatCardDisplay = ({
                            currentCard,
                            selectedCategory,
                            selectedCardIndex,
                            filteredCards,
                            onNext,
                            onPrev,
                            onCardSelect
                          }: CheatCardDisplayProps) => {

  const {selectedLang} = useLangStore();
  const isFirst = selectedCardIndex === 0;
  const isLast = selectedCardIndex === filteredCards.length - 1;
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-6"
      layout
      initial={ {scale: 0.95, opacity: 0} }
      animate={ {scale: 1, opacity: 1} }
      transition={ {duration: 0.5, delay: 0.3} }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={ `${ selectedCategory }-${ selectedCardIndex }` }
          initial={ {opacity: 0, x: 20} }
          animate={ {opacity: 1, x: 0} }
          exit={ {opacity: 0, x: -20} }
          transition={ {duration: 0.3} }
        >
          <div className="mb-6">
            <motion.h2
              className="text-xl sm:text-2xl font-bold text-slate-800 mb-3"
              initial={ {opacity: 0, y: 10} }
              animate={ {opacity: 1, y: 0} }
              transition={ {duration: 0.4, delay: 0.1} }
            >
              { currentCard.title }
            </motion.h2>
            <motion.h3
              className="text-lg sm:text-xl text-emerald-600 font-semibold mb-4"
              initial={ {opacity: 0, y: 10} }
              animate={ {opacity: 1, y: 0} }
              transition={ {duration: 0.4, delay: 0.2} }
            >
              { currentCard.subtitle }
            </motion.h3>
            <motion.p
              className="text-slate-700 text-base sm:text-lg leading-relaxed"
              initial={ {opacity: 0, y: 10} }
              animate={ {opacity: 1, y: 0} }
              transition={ {duration: 0.4, delay: 0.3} }
            >
              { currentCard.infoTexts.find((text: InfoText) => text.lang === selectedLang.toUpperCase())?.text }
            </motion.p>
          </div>

          <motion.div
            className="flex items-center justify-between pt-6 border-t border-slate-200"
            initial={ {opacity: 0, y: 10} }
            animate={ {opacity: 1, y: 0} }
            transition={ {duration: 0.4, delay: 0.4} }
          >
            <Button
              buttonType="primary"
              onClick={ onPrev }
              disabled={ isFirst }
              className="flex items-center gap-2"
            >
              <ChevronLeft size={ 20 }/>
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex items-center gap-2">
              { filteredCards.map((card, index) => (
                <button
                  key={ card.id }
                  onClick={ () => onCardSelect(index) }
                  className={ `w-2 h-2 rounded-full transition-colors ${
                    index === selectedCardIndex ? 'bg-emerald-600' : 'bg-slate-300'
                  }` }
                />
              )) }
            </div>

            <Button
              buttonType="primary"
              onClick={ onNext }
              disabled={ isLast }
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={ 20 }/>
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default CheatCardDisplay;