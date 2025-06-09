import CheatCardModel from "../models/CheatCardModel.ts";
import { useLangStore } from "../../../../store/store.ts";
import Button from "../../../ui/button/Button.tsx";
import { AnimatePresence, motion } from "motion/react";

type Props = CheatCardModel & {
  onNext: () => void,
  onPrev: () => void,
  isFirst: boolean,
  isLast: boolean
};

const containerVariants = {
  hidden: {opacity: 0},
  show: {
    duration: 2,
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      type: "spring",
      damping: 20,
    }
  }
};

const itemVariants = {
  hidden: {opacity: 0, x: -20},
  show: {opacity: 1, x: 0}
};

const CheatCard = ({title, subtitle, infoTexts, onNext, onPrev, isFirst, isLast}: Props) => {
  const {selectedLang} = useLangStore();

  return (
    <AnimatePresence mode="popLayout">
      <motion.article
        className="shadow-sm rounded-xl border border-gray-200 max-w-3xl"
        variants={ containerVariants }
        initial="hidden"
        animate="show"
        exit={ {opacity: 0, x: -20} }
      >
        <motion.h2
          className="block w-full text-xl font-bold bg-zinc-800 text-emerald-600 px-4 py-2 rounded-t-xl shadow-sm"
          variants={ itemVariants }
        >
          { title }
        </motion.h2>
        <div className="p-4">
          <motion.h3
            className="text-lg font-semibold text-gray-700 mb-3"
            variants={ itemVariants }
          >
            { subtitle }
          </motion.h3>
          <motion.p
            className="text-md text-gray-700"
            variants={ itemVariants }
          >
            { infoTexts.find(text => text.lang === selectedLang.toUpperCase())?.text }
          </motion.p>
        </div>
        <motion.div className="flex justify-between p-3" variants={ itemVariants }>
          <Button buttonType="primary" onClick={ onPrev } disabled={ isFirst }>Previous</Button>
          <Button buttonType="primary" onClick={ onNext } disabled={ isLast }>Next</Button>
        </motion.div>
      </motion.article>
    </AnimatePresence>
  )
}

export default CheatCard;
